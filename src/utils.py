from datetime import datetime, timedelta


def adjust_duplicate(s_date, s_time):
    # purify data
    s_date = [str(x).split(" ")[0] for x in s_date]
    s_time = [str(x).split(" ")[0] for x in s_time]

    print("s date", s_date)
    print("s time", s_time)
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
        previous_date = datetime.strptime(
            s_date[target_index].replace('"', ""), "%Y-%m-%d"
        ) - timedelta(days=1)
        previous_date = previous_date.strftime("%Y-%m-%d")
        print("duplicate date: ", duplicate_date)
        print("previous date: ", previous_date)

    if previous_date:
        # get the index of duplicate date
        target_index = s_date.index(duplicate_date)
        # check if the previous date is present in the list
        if s_date[target_index + 2] == str(previous_date):
            print("Previous date present")
            # as the previous date is present, system will just drop the duplicate
            s_date.remove(s_date[target_index])
            s_time.remove(s_time[target_index])
        else:
            print("Previous date isn't present")
            # as the previous date isn't present
            # adjust one duplicate to the previous date
            s_date.insert(target_index + 2, previous_date)
            s_time.insert(target_index + 2, duplicate_time)
            s_date.remove(s_date[target_index])
            s_time.remove(s_time[target_index])

    print("sleep date")
    print(s_date)
    print("sleep time")
    print(s_time)

    return s_date, s_time
