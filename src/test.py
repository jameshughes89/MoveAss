from datetime import datetime, timedelta

# def calculate_average_bedtime(bedtimes, trigger):
#     total_time = 0
#     for bedtime in bedtimes:
#         # Convert bedtime string to datetime
#         bedtime_dt = datetime.strptime(bedtime, "%Y-%m-%d %I:%M%p")
#         # print('hour: ', bedtime_dt.hour, bedtime_dt.minute)
        
#         if trigger == 'start':
#           # Check if bedtime crosses midnight
#           if bedtime_dt.hour < 12:  # Assumes that times before 12:00PM are for the next day
#               print('hour less: ', bedtime_dt.hour, bedtime_dt.minute)
#               bedtime_dt = bedtime_dt - timedelta(days=1)
#               total_time += ((12 + bedtime_dt.hour) * 60) + bedtime_dt.minute
#           else:
#             print('hour more: ', bedtime_dt.hour, bedtime_dt.minute)
#             total_time += ((bedtime_dt.hour-12) * 60) + bedtime_dt.minute
#           average_time = (total_time / len(bedtimes)) / 60
#           if round(average_time, 2) > 12:
#               extension = "am"
#           else:
#               extension = "pm"
#           # print(round(average_time))

#         if trigger == 'end':
#           # Check if bedtime crosses midnight
#           print('hour calc for end: ', bedtime_dt.hour, bedtime_dt.minute)
#           bedtime_dt = bedtime_dt - timedelta(days=1)
#           total_time += ((bedtime_dt.hour) * 60) + bedtime_dt.minute

#           average_time = (total_time / len(bedtimes)) / 60
#           if round(average_time, 2) < 12:
#               extension = "am"
#           else:
#               extension = "pm"
#           # print(round(average_time))
    
#     return str(round(average_time, 2)) + extension

# # Your provided dataset
# bedtimes = [
#     "2022-09-20 10:30PM",
#     "2022-09-20 12:21AM",
#     "2022-09-19 1:11AM",
#     "2022-09-18 2:34AM",
#     "2022-09-17 1:08AM",
#     "2022-09-16 1:23AM",
#     "2022-09-14 10:01PM"
# ]

# endtimes = [
#     "2022-09-21 6:08AM",
#     "2022-09-20 9:33AM",
#     "2022-09-19 9:49AM",
#     "2022-09-18 9:04AM",
#     "2022-09-17 9:12AM",
#     "2022-09-16 9:07AM",
#     "2022-09-15 6:08AM"
# ]

# # Calculate and print the average bedtime
# average_bedtime = calculate_average_bedtime(bedtimes, 'start')
# print("Average Bedtime:", average_bedtime)

# average_bedtime = calculate_average_bedtime(endtimes, 'end')
# print("Average Waketime:", average_bedtime)


def adjust_duplicate(s_date, s_time):
    sleept_dict = {}
    duplicate_date = None
    duplicate_time = None
    previous_date = None

    for x in range(len(s_date)):
        # print(s_date[x])
        if s_date[x] not in sleept_dict:
            sleept_dict[s_date[x]] = s_time[x]
        else:
            duplicate_date = s_date[x]
            duplicate_time = s_time[x]

    # print("sleept dict")
    # print(sleept_dict)
    # print("duplicate sleept date")
    # print(duplicate_date)
    # print("duplicate sleep time")
    # print(duplicate_time)

    if duplicate_date:
        # if duplicate data found, find the key of that data in the list
        target_index = s_date.index(duplicate_date)
        # print(target_index)
        previous_date = datetime.strptime(s_date[target_index], '%Y-%m-%d') - timedelta(days=1)
        previous_date = previous_date.strftime('%Y-%m-%d')
        print("duplicate date: ", duplicate_date)
        print("previous date: ", previous_date)
    
    if previous_date:
        # get the index of duplicate date
        target_index = s_date.index(duplicate_date)
        # check if the previous date is present in the list
        if s_date[target_index+2] == str(previous_date):
            print("Previous date present")
            # as the previous date is present, system will just drop the duplicate
            s_date.remove(s_date[target_index])
            s_time.remove(s_time[target_index])
        else:
            print("Previous date isn't present")
            # as the previous date isn't present
            # adjust one duplicate to the previous date
            s_date.insert(target_index+2, previous_date)
            s_time.insert(target_index+2, duplicate_time)
            s_date.remove(s_date[target_index])
            s_time.remove(s_time[target_index])


    print("sleep date")
    print(s_date)
    print("sleep time")
    print(s_time)

sleep_data = [
    '2023-05-15',
    '2023-05-14',
    '2023-05-13',
    '2023-05-13',
    '2023-05-12',
    '2023-05-11',
    '2023-05-10',
    '2023-05-09',
    '2023-05-08',
]

sleep_time = [
    '7.98',
    '6.00',
    '8.22',
    '7.63',
    '1.12',
    '6.58',
    '6.90',
    '8.00',
    '7.00'
]

adjust_duplicate(sleep_data, sleep_time)