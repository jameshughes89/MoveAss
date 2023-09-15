import math
import re
from datetime import date, datetime, timedelta

import matplotlib
import pandas as pd
from dateutil.parser import parse
from flask import Flask, flash, redirect, render_template, request

matplotlib.use("Agg")
import os

import matplotlib.pyplot as plt
import numpy as np

from utils import adjust_duplicate

app = Flask(__name__)

IMG_FOLDER = os.path.join("static", "images")
app.config["UPLOAD_FOLDER"] = IMG_FOLDER

data_dict = {}
all_metrics = {}
age = 0


@app.route("/", methods=["GET", "POST"])
def main():
    global data_dict
    global all_metrics
    global age

    data_dict = {}
    all_metrics = {}
    age = 0

    if request.method == "POST":
        if "csvFile" in request.files:
            file = request.files["csvFile"]
            parse_csv_file(file)
            return render_template("select_dob.html")

    return render_template("upload_file.html")


@app.route("/dob", methods=["POST"])
def dob():
    if request.method == "POST" and data_dict != {}:
        if "dob" in request.form:
            born = parse(request.form["dob"])
            weight = request.form["weight"]
            height = request.form["height"]
            bmi = 0
            if weight and height:
                bmi = calculate_bmi(weight, height)
            print("WEIGHT: ", weight)
            print("HEIGHT: ", height)
            today = date.today()
            age = (
                today.year
                - born.year
                - ((today.month, today.day) < (born.month, born.day))
            )
            if not calculate_metrics():
                return render_template(
                    "upload_file.html", msg="Not enough data to calculate metrics !!"
                )
            return render_template(
                "status_table.html", all_metrics=all_metrics, bmi=bmi
            )

    return render_template("upload_file.html")


@app.route("/physical_activity_report", methods=["GET"])
def physical_activity_report():
    if all_metrics == {}:
        return render_template("upload_file.html")
    return render_template("physical_activity.html", all_metrics=all_metrics)


@app.route("/sedentary_time_report", methods=["GET"])
def sedentary_time_report():
    if all_metrics == {}:
        return render_template("upload_file.html")
    return render_template("sedentary_time.html", all_metrics=all_metrics)


@app.route("/sleep_time_report", methods=["GET"])
def sleep_time_report():
    if all_metrics == {}:
        return render_template("upload_file.html")
    return render_template("sleep_time.html", all_metrics=all_metrics)


def clean_col_data(x):
    try:
        return int(x.replace('"', ""))
    except ValueError:
        return np.nan


def calculate_metrics():
    # calculating metrics for physical activity
    activities_data = data_dict["Activities"]

    activities_data["Minutes Fairly Active"] = activities_data[
        "Minutes Fairly Active"
    ].apply(clean_col_data)
    activities_data["Minutes Very Active"] = activities_data[
        "Minutes Very Active"
    ].apply(clean_col_data)
    activities_data["Minutes Lightly Active"] = activities_data[
        "Minutes Lightly Active"
    ].apply(clean_col_data)
    activities_data["Minutes Sedentary"] = activities_data["Minutes Sedentary"].apply(
        clean_col_data
    )
    activities_data.dropna(inplace=True)

    activities_data = activities_data.loc[
        (
            activities_data["Minutes Sedentary"]
            + activities_data["Minutes Lightly Active"]
            + activities_data["Minutes Fairly Active"]
            + activities_data["Minutes Very Active"]
        )
        >= 600
    ]
    if len(activities_data) < 3:
        return False

    activities_data["Steps"] = activities_data["Steps"].apply(clean_col_data)

    activities_data["Minutes Active"] = (
        activities_data["Minutes Fairly Active"]
        + activities_data["Minutes Very Active"]
    )
    total_minutes_per_week = activities_data["Minutes Active"].sum()
    all_metrics["physical_activity_average_steps"] = round(
        activities_data["Steps"].mean()
    )
    all_metrics["physical_activity_total_minutes"] = total_minutes_per_week

    threshold = 0
    if age >= 18 and age <= 64:
        threshold = 200
        if total_minutes_per_week < 200:
            all_metrics["physical_activity_status"] = "FAIL"
        else:
            all_metrics["physical_activity_status"] = "PASS"
    else:
        threshold = 150
        if total_minutes_per_week < 150:
            all_metrics["physical_activity_status"] = "FAIL"
        else:
            all_metrics["physical_activity_status"] = "PASS"

    all_metrics["physical_activity_threshold"] = threshold
    create_week_bar_graph(
        "week_bar_physical_activity.png",
        activities_data,
        "Date",
        "Minutes Active",
        "Moderate-to-Vigorous Physical Activity (min)",
    )
    create_single_bar_graph(
        "single_bar_physical_activity.png",
        total_minutes_per_week,
        "Moderate-to-Vigorous Physical Activity (min/week)",
        float("inf"),
        threshold,
        [threshold],
        "min",
    )
    # print("ACTIVITIES DATA: ")
    # print(activities_data)

    # calculate metrics for sedentary time
    activities_data["Hours Sedentary"] = activities_data["Minutes Sedentary"].apply(
        lambda x: x / 60
    )
    # s_convertion = round(activities_data['Minutes Sedentary'].mean(), 2)
    # s_minutes_per_day = s_convertion / 7
    # s_hours_per_day = s_minutes_per_day / 60
    all_metrics["sedentary_time_average"] = round(
        activities_data["Minutes Sedentary"].mean(), 2
    )
    all_metrics["patiend_average_st_hours_day"] = round(
        all_metrics["sedentary_time_average"] / 60, 1
    )
    all_metrics["sedentary_time_guideline"] = 8
    if all_metrics["sedentary_time_average"] <= all_metrics["sedentary_time_guideline"]:
        all_metrics["sedentary_time_status"] = "PASS"
    else:
        all_metrics["sedentary_time_status"] = "FAIL"
    create_week_bar_graph_alter(
        "week_bar_sedentary_time.png",
        activities_data,
        "Date",
        "Hours Sedentary",
        "Sedentary time (hours)",
    )
    create_single_bar_graph(
        "single_bar_sedentary_time.png",
        round(all_metrics["sedentary_time_average"] / 60, 2),
        "Sedentary time (hours/day)",
        all_metrics["sedentary_time_guideline"],
        0,
        [all_metrics["sedentary_time_guideline"]],
        "hrs",
    )

    # calculate metrics for sleep time
    sleep_data = data_dict["Sleep"]
    print("DATA DICT SLEEP: ", sleep_data["Start Time"])
    sleep_data["Minutes Awake"] = sleep_data["Minutes Awake"].apply(
        lambda x: int(x.replace('"', ""))
    )
    sleep_data["Hours Awake"] = sleep_data["Minutes Awake"].apply(
        lambda x: round(x / 60, 2)
    )
    sleep_data["Time in Bed"] = sleep_data["Time in Bed"].apply(
        lambda x: int(x.replace('"', ""))
    )
    sleep_data["Hours Bed"] = sleep_data["Time in Bed"].apply(
        lambda x: round(x / 60, 2)
    )
    sleep_data["Minutes Asleep"] = sleep_data["Minutes Asleep"].apply(
        lambda x: int(x.replace('"', ""))
    )
    sleep_data["Hours Asleep"] = sleep_data["Minutes Asleep"].apply(
        lambda x: round(x / 60, 2)
    )

    sleep_data["Date"] = sleep_data["Start Time"].apply(lambda x: x.split(" ")[0])

    all_metrics["sleep_time_bed"] = round(sleep_data["Hours Bed"].mean(), 2)
    all_metrics["sleep_time_average"] = calculate_average_time(
        sleep_data["Start Time"], "start"
    )
    all_metrics["wake_time_average"] = calculate_average_time(
        sleep_data["End Time"], "end"
    )
    all_metrics["sleep_time_wake"] = round(sleep_data["Hours Awake"].mean(), 2)
    all_metrics["sleep_time_asleep"] = round(sleep_data["Hours Asleep"].mean(), 2)
    all_metrics["sleep_time_guideline"] = "7 - 9"

    if all_metrics["sleep_time_asleep"] >= 7 and all_metrics["sleep_time_asleep"] <= 9:
        all_metrics["sleep_time_status"] = "PASS"
    else:
        all_metrics["sleep_time_status"] = "FAIL"

    # print("SLEEP DATA: ", sleep_data)

    create_week_bar_graph(
        "week_bar_sleep_time.png",
        sleep_data,
        "Date",
        "Hours Asleep",
        "Sleep time (hours)",
    )
    create_single_bar_graph(
        "single_bar_sleep_time.png",
        all_metrics["sleep_time_asleep"],
        "Sleep time (hours/day)",
        9,
        7,
        [7, 9],
        "hrs",
    )

    print(all_metrics)
    return True


def calculate_bmi(weight_lbs, height_cm):
    weight_lbs = float(weight_lbs)
    height_cm = float(height_cm)
    # Convert weight from lbs to kg
    weight_kg = weight_lbs * 0.45359237

    # Convert height from cm to meters
    height_m = height_cm / 100

    # Calculate BMI
    bmi = weight_kg / (height_m**2)

    return round(bmi, 1)


def calculate_average_time(bedtimes, trigger):
    print("BED TIMES: ", bedtimes)
    total_time = 0
    for bedtime in bedtimes:
        bedtime = bedtime.replace('"', "")
        # Convert bedtime string to datetime
        bedtime_dt = datetime.strptime(bedtime, "%Y-%m-%d %I:%M%p")
        # print('hour: ', bedtime_dt.hour, bedtime_dt.minute)

        if trigger == "start":
            # Check if bedtime crosses midnight
            if (
                bedtime_dt.hour < 12
            ):  # Assumes that times before 12:00PM are for the next day
                print("hour less: ", bedtime_dt.hour, bedtime_dt.minute)
                bedtime_dt = bedtime_dt - timedelta(days=1)
                total_time += ((12 + bedtime_dt.hour) * 60) + bedtime_dt.minute
            else:
                print("hour more: ", bedtime_dt.hour, bedtime_dt.minute)
                total_time += ((bedtime_dt.hour - 12) * 60) + bedtime_dt.minute
            average_time = math.floor((total_time / len(bedtimes)) / 60)
            calc_min = round((total_time / len(bedtimes)) % 60)
            if calc_min < 10:
                calc_min = "0" + str(calc_min)
            if round(average_time, 2) >= 12:
                extension = "am"
            else:
                extension = "pm"
            print("average time: ", average_time, " total time: ", total_time)

        if trigger == "end":
            # Check if bedtime crosses midnight
            print("hour calc for end: ", bedtime_dt.hour, bedtime_dt.minute)
            bedtime_dt = bedtime_dt - timedelta(days=1)
            total_time += ((bedtime_dt.hour) * 60) + bedtime_dt.minute

            average_time = math.floor((total_time / len(bedtimes)) / 60)
            calc_min = round((total_time / len(bedtimes)) % 60)
            if calc_min < 10:
                calc_min = "0" + str(calc_min)
            if round(average_time, 2) < 12:
                extension = "am"
            else:
                extension = "pm"
            # print(round(average_time))

    if average_time > 12:
        average_time = average_time - 12
    return str(average_time) + ":" + str(calc_min) + extension


def create_week_bar_graph_alter(img_save_path, df, x_name, y_name, y_label):
    # print("ACTIVITIES DATA: ")
    # print(df[x_name])

    # Convert date strings to datetime objects
    df[x_name] = pd.to_datetime(df[x_name]).dt.date
    df["date_only"] = pd.to_datetime(df[x_name]).dt.date

    # Determine weekends and set colors
    colors = []
    labels = []
    for date in df[x_name]:
        if date.weekday() >= 5:  # Saturday (5) and Sunday (6)
            colors.append("g")  # Green for weekends
            labels.append("Weekend")  # Add a label for weekends
        else:
            colors.append("b")  # Blue for weekdays
            labels.append("Weekdays")  # Add a label for weekdays

    # Create the bar plot
    df = df.drop_duplicates(subset=["date_only"])
    df = df.head(7)
    plot = df.plot.bar(x=x_name, y=y_name, rot=20, legend=False, color=colors)
    plot.set_ylabel(y_label)

    # Set custom legend using labels
    plt.legend(labels)

    fig = plot.get_figure()
    img_path = os.path.join(app.config["UPLOAD_FOLDER"], img_save_path)
    if os.path.exists(img_path):
        os.remove(img_path)
    fig.savefig(img_path)
    plt.clf()


def create_week_bar_graph(img_save_path, df, x_name, y_name, y_label):

    # Remove double quotes and comma from date strings
    df[x_name] = df[x_name].str.replace('"', "").str.rstrip(",")
    df["date_only"] = pd.to_datetime(df[x_name]).dt.date
    # print("sleep date fromatted: ")
    # print(df)

    # Convert date strings to datetime objects
    df[x_name] = pd.to_datetime(df[x_name]).dt.date

    # Determine weekends and set colors
    colors = []
    labels = []
    df = df.drop_duplicates(subset=["date_only"])
    for date in df[x_name]:
        print(f"day: {date.weekday()}")
        if date.weekday() >= 5:  # Saturday (5) and Sunday (6)
            colors.append("g")  # Green for weekends
            labels.append("Weekend")  # Add a label for weekends
        else:
            colors.append("b")  # Blue for weekdays
            labels.append("Weekdays")  # Add a label for weekdays

    # Create the bar plot
    # print("WHOLE DF: ======")
    # print(df)

    df = df.head(7)
    plot = df.plot.bar(x=x_name, y=y_name, rot=20, legend=False, color=colors)
    plot.set_ylabel(y_label)

    # Set custom legend using labels
    plt.legend(labels)

    fig = plot.get_figure()
    img_path = os.path.join(app.config["UPLOAD_FOLDER"], img_save_path)
    if os.path.exists(img_path):
        os.remove(img_path)
    fig.savefig(img_path)
    plt.clf()


def create_single_bar_graph(
    img_save_path,
    data,
    y_label,
    upper_threshold,
    lower_threshold,
    threshold_lines,
    text_post,
):
    values = np.array([data])
    x = np.arange(len(values)) + 0.5

    # and plot it
    fig, ax = plt.subplots()
    fig.set_size_inches(5, 10)
    if data >= lower_threshold and data <= upper_threshold:
        ax.bar(x, values, 0.5, color="g", align="center")
    elif data > upper_threshold:
        ax.bar(x, [upper_threshold], 0.5, color="g", align="center")
        ax.bar(
            x,
            [data - upper_threshold],
            0.5,
            color="r",
            bottom=upper_threshold,
            align="center",
        )
    else:
        ax.bar(x, values, 0.5, color="r", align="center")

    ax.set_xlim(0, 1)

    # horizontal line indicating the threshold
    for threshold_line in threshold_lines:
        ax.hlines(y=threshold_line, xmin=0, xmax=1, linewidth=4, color="k")

    ax.set_ylabel(y_label)
    ax.set_xticks([])

    plt.text(
        0.38,
        data,
        str(data) + " " + text_post,
        fontsize=18,
        bbox=dict(facecolor="white"),
    )
    img_path = os.path.join(app.config["UPLOAD_FOLDER"], img_save_path)
    if os.path.exists(img_path):
        os.remove(img_path)
    fig.savefig(img_path)
    plt.clf()


def parse_csv_file(file):
    data_type = ""
    for line in file:
        line_data = line.decode("utf-8").strip()
        if "Food Log" in line_data:
            break
        if "Body" in line_data and data_type != "Body":
            data_type = "Body"
            data_dict[data_type] = []
            continue
        if "Foods" in line_data and data_type != "Foods":
            data_type = "Foods"
            data_dict[data_type] = []
            continue
        if "Activities" in line_data and data_type != "Activities":
            data_type = "Activities"
            data_dict[data_type] = []
            continue
        if "Sleep" in line_data and data_type != "Sleep":
            data_type = "Sleep"
            data_dict[data_type] = []
            continue

        if line_data == "" or all(c == "," for c in line_data):
            continue

        data_dict[data_type].append(clean_line_data(line_data))
        print("LINE DATA: ", line_data)

    for data_type in data_dict:
        data_dict[data_type] = pd.DataFrame(
            data_dict[data_type][1:], columns=data_dict[data_type][0]
        )


def clean_line_data(line_data):
    line_data = re.sub(
        r'(".*?")', lambda match: match.group(1).replace(",", ""), line_data
    )
    line_data = line_data.split(",")
    cleaned = []
    for data in line_data:
        cleaned.append(data.replace('"', ""))
    return line_data


if __name__ == "__main__":
    app.run(host="localhost", port=8000, debug=True)
