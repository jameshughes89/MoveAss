// const Papa = require("papaparse")

const KGS_PER_LBS = 1 / 2.205;
const M_PER_CM = 1 / 100;

const COLOUR_UNDERWEIGHT = 'powderblue';
const COLOUR_NORMAL_WEIGHT = 'palegreen';
const COLOUR_OVERWEIGHT = 'palegoldenrod';
const COLOUR_OBESE_CLASS_I = 'lightsalmon';
const COLOUR_OBESE_CLASS_II = 'salmon';
const COLOUR_OBESE_CLASS_III = 'darksalmon';

const COLOUR_PASS = 'palegreen';
const COLOUR_FAIL = 'pink';

const TARGET_ACTIVITY_MINUTES_BETWEEN_18_65 = 200;
const TARGET_ACTIVITY_MINUTES_OUTSIDE_18_65 = 150;

const TARGET_SEDENTARY_MAXIMUM_MINUTES = 480;
const TARGET_SLEEP_MINIMUM_MINUTES = 420;
const TARGET_SLEEP_MAXIMUM_MINUTES = 540;

let activityData;
let sleepData;
let activityTarget;
let activityColour;
let sedentaryColour;
let sleepColour;

function handleFile() {
  const file = document.getElementById('fileInput').files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    const csvData = event.target.result;
    activityData = parseFitbitCsvString(csvData, 1, 9);
    sleepData = parseFitbitCsvString(csvData, 12, 19);
    sleepData.set('Minutes Asleep', sleepData.get('Minutes Asleep').reverse());
    dobWeightHeight.style.display = 'block';
  };
  reader.readAsText(file);
}

function handleDobWeightHeight() {
  const dob = document.getElementById('dob').value;
  const weightLb = document.getElementById('weightLb').value;
  const heightCm = document.getElementById('heightCm').value;

  const weightKG = weightLb * KGS_PER_LBS;
  const heightM = heightCm * M_PER_CM;
  const bmi = bmiKgM(weightKG, heightM).toFixed(1);
  const bmiClass = bmiCategory(bmi);
  const bmiText = bmi.toString().concat(': ', bmiClass);

  bmiSummary.style.display = 'block';
  bmiAndClass.innerText = bmiText;
  const bmiColour = bmiCategoryColour(bmi);
  bmiAndClass.style.backgroundColor = bmiColour;

  const dobAsDate = new Date(dob);
  const today = new Date();
  const age = ageFromDobAsOfDay(dobAsDate, today);
  activityTarget = activityTargetFromAge(age);
  const totalModerateVigorousActivity =
    sumOf(activityData.get('Minutes Fairly Active')) + sumOf(activityData.get('Minutes Very Active'));
  const didPassActivity = didPassActivityTarget(totalModerateVigorousActivity, activityTarget);
  activityColour = didPassColour(didPassActivity);
  physicalActivity.style.backgroundColor = activityColour;

  const didPassSedentary = didPassSedentaryTarget(activityData.get('Minutes Sedentary'));
  sedentaryColour = didPassColour(didPassSedentary);
  sedentaryTime.style.backgroundColor = sedentaryColour;

  const didPassSleep = didPasSleepTarget(sleepData.get('Minutes Asleep'));
  sleepColour = didPassColour(didPassSleep);
  sleepTime.style.backgroundColor = sleepColour;
}

function plotPhysicalActivity() {
  physicalActivitySummary.style.display = 'block';
  sedentaryTimeSummary.style.display = 'none';
  sleepTimeSummary.style.display = 'none';

  let dates = activityData.get('Date');
  let minutesModerate = activityData.get('Minutes Fairly Active');
  let minutesVigorous = activityData.get('Minutes Very Active');
  let averageSteps = averageOf(activityData.get('Steps'));
  let averageModerateVigorous = averageOf(minutesModerate.concat(minutesVigorous));

  const moderate = {
    x: dates,
    y: minutesModerate,
    name: 'Moderate',
    type: 'bar',
  };
  const vigorous = {
    x: dates,
    y: minutesVigorous,
    name: 'Vigorous',
    type: 'bar',
  };
  const averageTarget = {
    x: [dates[dates.length - 1]],
    y: [activityTarget / dates.length],
    mode: 'text',
    text: ['Average Target'],
    font: {
      color: 'black',
    },
    hoverinfo: 'skip',
    showlegend: false,
  };
  const average = {
    x: [dates[0]],
    y: [averageModerateVigorous],
    mode: 'text',
    text: ['Average'],
    font: {
      color: activityColour,
    },
    hoverinfo: 'skip',
    showlegend: false,
  };
  const layout = {
    title: 'Physical Activity Time',
    xaxis: {
      title: 'Dates',
    },
    yaxis: {
      title: 'Minutes',
    },
    barmode: 'stack',
    shapes: [
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: averageModerateVigorous,
        x1: 1,
        y1: averageModerateVigorous,
        line: {
          color: activityColour,
          width: 1.5,
        },
      },
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: activityTarget / dates.length,
        x1: 1,
        y1: activityTarget / dates.length,
        line: {
          color: 'black',
          width: 1.5,
        },
      },
    ],
  };
  Plotly.newPlot('plot', [moderate, vigorous, average, averageTarget], layout);
  averageStepsSummary.innerText = 'Average Steps/Day: '.concat(averageSteps.toFixed(1));
  averageModerateVigorousSummary.innerText = 'Average Moderate to Vigorous Minutes/Day: '.concat(
    averageModerateVigorous.toFixed(1),
  );
}

function plotSedentaryTime() {
  physicalActivitySummary.style.display = 'none';
  sedentaryTimeSummary.style.display = 'block';
  sleepTimeSummary.style.display = 'none';

  let dates = activityData.get('Date');
  let minutesSedentary = activityData.get('Minutes Sedentary');
  let averageSedentaryTime = averageOf(minutesSedentary);

  let minutesSedentaryBelowTarget = [];
  let minutesSedentaryAboveTarget = [];
  for (let i = 0; i < dates.length; i++) {
    if (minutesSedentary[i] > TARGET_SEDENTARY_MAXIMUM_MINUTES) {
      minutesSedentaryBelowTarget.push(TARGET_SEDENTARY_MAXIMUM_MINUTES);
      minutesSedentaryAboveTarget.push(minutesSedentary[i] - TARGET_SEDENTARY_MAXIMUM_MINUTES);
    } else {
      minutesSedentaryBelowTarget.push(minutesSedentary[i]);
      minutesSedentaryAboveTarget.push(0);
    }
  }

  const minutesBelowTarget = {
    x: dates,
    y: minutesSedentaryBelowTarget,
    type: 'bar',
    name: 'Sedentary Time',
  };
  const minutesAboveTarget = {
    x: dates,
    y: minutesSedentaryAboveTarget,
    type: 'bar',
    name: 'Sedentary Time Above Target',
    marker: {
      color: 'red',
    },
  };
  const target = {
    x: [dates[dates.length - 1]],
    y: [TARGET_SEDENTARY_MAXIMUM_MINUTES],
    mode: 'text',
    text: ['Target'],
    font: {
      color: 'black',
    },
    hoverinfo: 'skip',
    showlegend: false,
  };
  const average = {
    x: [dates[0]],
    y: [averageSedentaryTime],
    mode: 'text',
    text: ['Average'],
    font: {
      color: sedentaryColour,
    },
    hoverinfo: 'skip',
    showlegend: false,
  };
  const layout = {
    title: 'Sedentary Time',
    xaxis: {
      title: 'Dates',
    },
    yaxis: {
      title: 'Minutes',
    },
    barmode: 'stack',
    shapes: [
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: averageSedentaryTime,
        x1: 1,
        y1: averageSedentaryTime,
        line: {
          color: sedentaryColour,
          width: 1.5,
        },
      },
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: TARGET_SEDENTARY_MAXIMUM_MINUTES,
        x1: 1,
        y1: TARGET_SEDENTARY_MAXIMUM_MINUTES,
        line: {
          color: 'black',
          width: 1.5,
        },
      },
    ],
  };
  Plotly.newPlot('plot', [minutesBelowTarget, minutesAboveTarget, target, average], layout);
  averageSedentaryTimeSummary.innerText = 'Average Sedentary Minutes/Day: '.concat(averageSedentaryTime.toFixed(1));
}

function plotSleepTime() {
  physicalActivitySummary.style.display = 'none';
  sedentaryTimeSummary.style.display = 'none';
  sleepTimeSummary.style.display = 'block';

  let dates = sleepData.get('Start Time');
  let minutesAsleep = sleepData.get('Minutes Asleep');
  let averageSleepTime = averageOf(minutesAsleep);

  let minutesAsleepAfterTargetCheck = [];
  let minutesAsleepAboveBelowTarget = [];
  for (let i = 0; i < dates.length; i++) {
    if (minutesAsleep[i] > TARGET_SLEEP_MAXIMUM_MINUTES) {
      minutesAsleepAfterTargetCheck.push(TARGET_SLEEP_MAXIMUM_MINUTES);
      minutesAsleepAboveBelowTarget.push(minutesAsleep[i] - TARGET_SLEEP_MAXIMUM_MINUTES);
    } else if (minutesAsleep[i] < TARGET_SLEEP_MINIMUM_MINUTES) {
      minutesAsleepAfterTargetCheck.push(minutesAsleep[i]);
      minutesAsleepAboveBelowTarget.push(TARGET_SLEEP_MINIMUM_MINUTES - minutesAsleep[i]);
    } else {
      minutesAsleepAfterTargetCheck.push(minutesAsleep[i]);
      minutesAsleepAboveBelowTarget.push(0);
    }
  }

  const minutesBelowMaxTarget = {
    x: dates,
    y: minutesAsleepAfterTargetCheck,
    type: 'bar',
    name: 'Minutes Asleep',
  };
  const minutesAboveMaxTarget = {
    x: dates,
    y: minutesAsleepAboveBelowTarget,
    type: 'bar',
    name: 'Minutes Asleep Above/Below Target',
    marker: {
      color: 'red',
    },
  };
  const targetMaximum = {
    x: [dates[dates.length - 1]],
    y: [TARGET_SLEEP_MAXIMUM_MINUTES],
    mode: 'text',
    text: ['Target Maximum'],
    font: {
      color: 'black',
    },
    hoverinfo: 'skip',
    showlegend: false,
  };
  const targetMinimum = {
    x: [dates[dates.length - 1]],
    y: [TARGET_SLEEP_MINIMUM_MINUTES],
    mode: 'text',
    text: ['Target Minimum'],
    font: {
      color: 'black',
    },
    hoverinfo: 'skip',
    showlegend: false,
  };
  const average = {
    x: [dates[0]],
    y: [averageSleepTime],
    mode: 'text',
    text: ['Average'],
    font: {
      color: sleepColour,
    },
    hoverinfo: 'skip',
    showlegend: false,
  };
  const layout = {
    title: 'Sleep Time',
    xaxis: {
      title: 'Sleep Start Time',
    },
    yaxis: {
      title: 'Minutes',
    },
    barmode: 'stack',
    shapes: [
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: averageSleepTime,
        x1: 1,
        y1: averageSleepTime,
        line: {
          color: sedentaryColour,
          width: 1.5,
        },
      },
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: TARGET_SLEEP_MAXIMUM_MINUTES,
        x1: 1,
        y1: TARGET_SLEEP_MAXIMUM_MINUTES,
        line: {
          color: 'black',
          width: 1.5,
        },
      },
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: TARGET_SLEEP_MINIMUM_MINUTES,
        x1: 1,
        y1: TARGET_SLEEP_MINIMUM_MINUTES,
        line: {
          color: 'black',
          width: 1.5,
        },
      },
    ],
  };
  Plotly.newPlot('plot', [minutesBelowMaxTarget, minutesAboveMaxTarget, targetMaximum, targetMinimum, average], layout);
  averageSleepTimeSummary.innerText = 'Average Sleep Hours/Day: '.concat((averageSleepTime / 60).toFixed(1));
}

/**
 * Get the weekly activity target for an individual based on their age.
 *
 * @param age - Age of the individual
 * @return Weekly activity target in minutes for the specified age
 */
function activityTargetFromAge(age) {
  if (age >= 18 && age < 65) {
    return TARGET_ACTIVITY_MINUTES_BETWEEN_18_65;
  } else {
    return TARGET_ACTIVITY_MINUTES_OUTSIDE_18_65;
  }
}

/**
 * Get the age of an individual on a specified date based on their date of birth and a specified date. To determine the
 * individual's current age, as of today, specify the asOf date as today.
 *
 * @param dob - The individual's date of birth
 * @param asOf - The date to calculate the age of the individual on (use "today" to determine the current age)
 * @return The age of the individual as of the specified date
 */
function ageFromDobAsOfDay(dob, asOf) {
  let age = asOf.getFullYear() - dob.getFullYear();
  if (asOf.getMonth() < dob.getMonth() || (asOf.getMonth() === dob.getMonth() && asOf.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Calculate the average of the numbers within an array.
 *
 * @param data - The array to calculate the average of
 * @return The average of the numbers within the array
 */
function averageOf(data) {
  if (data.length === 0) {
    return 0;
  } else {
    return sumOf(data) / data.length;
  }
}

/**
 * Calculate the BMI based on a mass in kilograms and height in meters.
 *
 * @param massKg - Mass in kilograms
 * @param heightM - Height in meters
 * @return The BMI of an individual in kg/(m^{2})
 */
function bmiKgM(massKg, heightM) {
  return massKg / heightM ** 2;
}

/**
 * Get a BMI categories based on a BMI. The BMI categories, as defined by the Wold Health Organization (WHO) are as
 * follows:
 *  bmi < 18.5 --- Underweight
 *  18.5 <= bmi < 25 --- Normal weight
 *  25 <= bmi < 30 --- Overweight
 *  30 <= bmi < 35 --- Obese (Class I)
 *  35 <= bmi < 40 --- Obese (Class II)
 *  40 <= bmi --- Obese (Class III)
 *
 * @param bmi - BMI of the individual
 * @return BMI Category
 */
function bmiCategory(bmi) {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal Weight';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight';
  } else if (bmi >= 30 && bmi < 35) {
    return 'Obese (Class I)';
  } else if (bmi >= 35 && bmi < 40) {
    return 'Obese (Class II)';
  } else {
    return 'Obese (Class III)';
  }
}

/**
 * Get the colour associated with the bmi category. The colours being returned were chosen to match the colours in the
 * image available on the Wikipedia page for "Body Mass Index" --- https://en.wikipedia.org/wiki/Body_mass_index. The
 * BMI categories, as defined by the Wold Health Organization (WHO) are as follows:
 *  bmi < 18.5 --- Underweight
 *  18.5 <= bmi < 25 --- Normal weight
 *  25 <= bmi < 30 --- Overweight
 *  30 <= bmi < 35 --- Obese (Class I)
 *  35 <= bmi < 40 --- Obese (Class II)
 *  40 <= bmi --- Obese (Class III)
 *
 * @param bmi - BMI of the individual
 * @return Colour string for the provided BMI
 */
function bmiCategoryColour(bmi) {
  if (bmi < 18.5) {
    return COLOUR_UNDERWEIGHT;
  } else if (bmi >= 18.5 && bmi < 25) {
    return COLOUR_NORMAL_WEIGHT;
  } else if (bmi >= 25 && bmi < 30) {
    return COLOUR_OVERWEIGHT;
  } else if (bmi >= 30 && bmi < 35) {
    return COLOUR_OBESE_CLASS_I;
  } else if (bmi >= 35 && bmi < 40) {
    return COLOUR_OBESE_CLASS_II;
  } else {
    return COLOUR_OBESE_CLASS_III;
  }
}

/**
 * Determine if an individual met or exceeded their physical activity target for the week.
 *
 * @param totalModerateVigorousActivity - Total moderate and vigorous activity minutes for the week
 * @param target - Physical activity minutes target for the week
 * @return If they met/exceeded their target (true) or not (false)
 */
function didPassActivityTarget(totalModerateVigorousActivity, target) {
  return totalModerateVigorousActivity >= target;
}

/**
 * Determine if an individual's weekly average sedentary time per day stayed below the sedentary target.
 *
 * @param averageSedentary - The average sedentary time in minutes of the individual
 * @return If they stayed below/met the target (true) or not (false)
 */
function didPassSedentaryTarget(averageSedentary) {
  return averageSedentary <= TARGET_SEDENTARY_MAXIMUM_MINUTES;
}

/**
 * Determine if an individual stayed between the target sleep times over the whole week. An individual passes if the
 * time asleep stays between the minimum and maximum targets each day. All days must be within the target th pass.
 *  *
 * @param sleepTimes - Array of total sleep times in minutes for each day
 * @return If they were within the window on all days (true) or not (fail)
 */
function didPasSleepTarget(sleepTimes) {
  for (let i = 0; i < sleepTimes.length; i++) {
    if (sleepTimes[i] < TARGET_SLEEP_MINIMUM_MINUTES || sleepTimes[i] > TARGET_SLEEP_MAXIMUM_MINUTES) {
      return false;
    }
  }
  return true;
}

/**
 * Get the colour associated with passing/failing a target.
 *
 * @param didPass - True if the target was met/exceeded, false otherwise
 * @return Colour string for a pass or fail
 */
function didPassColour(didPass) {
  if (didPass) {
    return COLOUR_PASS;
  } else {
    return COLOUR_FAIL;
  }
}

/**
 * Parse the string read from the fitbit "csv" file. This function can read the "activity" or "sleep" data as it simply
 * returns a map/dictionary of the data where the keys are the data's columns and the values are arrays containing the
 * ordered data within the rows. This function assumes that the first row of the data to be stored is immediately
 * following the header line. The end line specified will be included in the parsing. Any quotations and commas within
 * the data will be parsed out except if they exist in the header row, which contains keys for the dictionary.
 *
 * For activity data, the keys are:
 *  - Date
 *  - Calories Burned
 *  - Steps
 *  - Distance
 *  - Floors
 *  - Minutes Sedentary
 *  - Minutes Lightly Active
 *  - Minutes Fairly Active
 *  - Minutes Very Active
 *  - Activity Calories
 *
 * For sleep, the keys are:
 *  - Start Time
 *  - End Time
 *  - Minutes Asleep
 *  - Minutes Awake
 *  - Number of Awakenings
 *  - Time in Bed
 *  - Minutes REM Sleep
 *  - Minutes Light Sleep
 *  - Minutes Deep Sleep
 *
 * @param data - The full data string read from the csv file
 * @param headerLine - The line number of the header row (zero based indexing)
 * @param endLine - The line number of the last row to be read, inclusively (zero based indexing)
 * @return Map/dictionary of the data within the specified range
 */
function parseFitbitCsvString(data, headerLine, endLine) {
  const dataStartLine = headerLine + 1;
  const dataEndLine = endLine;
  const lines = data.split(/\r\n|\n/);
  const fields = new Map();
  if (lines.length === 0 || lines.length === 1) {
    return fields;
  }
  const keys = Papa.parse(lines[headerLine])['data'][0];
  for (let i = 0; i < keys.length; i++) {
    keys[i] = keys[i].trim();
    fields.set(keys[i], []);
  }
  for (let i = dataStartLine; i <= dataEndLine; i++) {
    const row = Papa.parse(lines[i])['data'][0];
    for (let j = 0; j < row.length; j++) {
      let data = row[j].trim().replace(/["']/g, '');
      if (j !== 0) {
        // Column 0 is the date
        data = data.replace(/,/g, '');
        data = Number(data);
      }
      fields.get(keys[j]).push(data);
    }
  }
  return fields;
}

/**
 * Calculate the sum of the numbers within an array.
 *
 * @param data - The array to sum the contents of
 * @return The sum of the numbers within the array
 */
function sumOf(data) {
  let runningTotal = 0;
  for (let i = 0; i < data.length; i++) {
    runningTotal += data[i];
  }
  return runningTotal;
}

// module.exports = {
//   COLOUR_UNDERWEIGHT,
//   COLOUR_NORMAL_WEIGHT,
//   COLOUR_OVERWEIGHT,
//   COLOUR_OBESE_CLASS_I,
//   COLOUR_OBESE_CLASS_II,
//   COLOUR_OBESE_CLASS_III,
//   COLOUR_PASS,
//   COLOUR_FAIL,
//   TARGET_ACTIVITY_MINUTES_BETWEEN_18_65,
//   TARGET_ACTIVITY_MINUTES_OUTSIDE_18_65,
//   activityTargetFromAge,
//   ageFromDobAsOfDay,
//   averageOf,
//   bmiKgM,
//   bmiCategory,
//   bmiCategoryColour,
//   didPassActivityTarget,
//   didPassSedentaryTarget,
//   didPasSleepTarget,
//   didPassColour,
//   parseFitbitCsvString,
//   sumOf,
// };
