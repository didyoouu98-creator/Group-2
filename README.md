1. **Problem**: Many companies struggle to track employees' learning progress and identify knowledge gaps across different departments. Without regular assessments, managers may find it difficult to evaluate employees' knowledge, identify training needs, and provide appropriate support. Employee training is important for maintaining job-related knowledge, encouraging continuous learning, and supporting performance reviews. However, managing attendance and training through separate systems can create unnecessary administrative work and take up employees' time. Therefore, our Employee Learning & Development Management System combines attendance tracking and employee training into one platform to improve efficiency and convenience. Employees can clock in and complete department-specific quizzes, while managers can monitor quiz participation, review learning results, and identify potential knowledge gaps. The system also provides personalized training recommendations and reward points to encourage continuous learning without unnecessarily disrupting daily work responsibilities. By combining these functions, our application aims to reduce administrative work, support employee development, and provide managers with useful information for training decisions.

2. **Core function**: Our Employee Learnings & Development Management System allows employees to clock in/ out using their employee ID and compete department specific quizzes in one platform. Employees can check their knowledge and expertise, track their learning progress, and receive rewards for quiz participation and strong performance depending on each department. This reward system encourages employees to stay motivated and engaged actively in continuous learning.
Furthermore, by combining attendance tracking and employee learning in one platform, the system reduces the need for separate websites and allows managers to manage both functions in one place. This would make it easier for managers to review employee information and reduce the administrative work of managing separate systems.
In addition, managers can use the manager dashboard to monitor quiz participation, review employee results, identify knowledge gaps, and analyze learning and participation trends over time. This system also provides training recommendations to help managers identify areas that need improvements and support employee development and regular performance reviews.
In order to encourage regular participation, the system also provides reminders for employees who miss their weekly quizzes. Repeated missed quizzes can trigger follow up notifications and managers need to check in to identify possible barriers through a survey and provide additional support. Moreover, attendance will be recorded independently from quiz performances, ensuring that quiz results do not affect employees’ attendance records.

***Key assumptions**:
Weekly quiz requirements: employees are expected to complete “one” mandatory quiz per week, while additional quizzes are optional.
Learning assessment: quiz results provide an indication of an employee's learning process but do not directly measure their overall work performance or productivity.
Missed quizzes: Missing a weekly quiz does not necessarily indicate a lack of employee knowledge.
Training recommendations: recommendations are intended to support managers’ decisions rather than automatically determine employee’s performance evaluations.
Reward points: Learning percentage and reward points are calculated separately. Optional quizzes may provide bonus points based on the system's reward eligibility rules.

3. **Testing**: We compared the expected and actual results with different employee/ work scenarios for each main function of our application. Also, we made the necessary changes and conducted retesting to verify after comparing expected and actual results, any changes required for improvements.

**1) Employee clock in/ out**: Create an entry record for employees at their time of arrival

**Expected results**: Record the time an employee checks in, or whether they are late, when taking the quiz.

**Actual results**: The employee’s arrival time is recorded, including any instances of lateness.

**Retesting**: after updating the attendance function, we tested employee clock in and out again using different arrival times. We checked whether the system recorded the correct times and identified late arrivals based on the attendance policy.

**2) Department specific quizzes**: Learning quizzes for each area within the organization

**Expected results**: The employee has a pre-assigned department; they must answer the questions corresponding to that specific department.

**Actual results**: The questions are displayed based on the employees' different departments.

**Retesting**: after revising the quiz functions, we tested employees from different departments again to check whether each employee received the appropriate department specific questions.

**3) Missed quiz reminder**: employees do not complete the weekly mandatory quiz

**Expected results**: the system displays a friendly reminder encouraging the employee to complete the missed quiz. If the employee repeatedly misses quizzes, the system automatically provides additional follow up notifications. 

**Actual results**: The system sends three alert messages: the first is triggered when a quiz is missed, serving as a reminder to complete it. The second is sent after three consecutive missed multiple-choice quizzes, seeking to understand why they were not completed. If five consecutive quizzes are missed, a further alert is issued, along with a suggestion to reach out to the employee to assess their situation and determine whether they require support.

**4) Learning score & rewards points**: verity that learning performance and reward points are calculated separately.

**Expected results**: learning % should be calculated using completed mandatory weekly quizzes only. Optional quizzes may increase reward points but should not affect the learning %.

**Actual results**: we identified that learning performance and reward points needed to be separated to prevent optional quiz participation from affecting learning assessments. 

**Retesting**: after separating the two measures, we tested the updated calculations again to check whether optional quiz points affected the learning % and whether reward points continued to accumulate accurately.

**5) Learning trends**: complete multiple quizzes with different scores and participation records over different periods  from the manager’s dashboard.

**Expected results**: the system collects the data from the quiz scores and participation over time, allowing managers to identify improvements, declining performance, and learning trends with a number of quiz sessions, number of unique participation, department filter, and function of comparing current/ previous results for the same employee

**Actual results**: the manager dashboard displayed quiz performance trends across four different dates. We compared the daily averages with the completed quiz session records and confirmed that the calculations were consistent. For example, the average score on November 16 was 93.75%, displayed as 94%. However, these trends represent company-wide quiz performance rather than individual employee improvement.

**6) Manager dashboard**: verify the accuracy of employee and company performance reports

**Expected results**: display consistent participation rates and quiz performance statistics

**Actual results**: we verified the displayed quiz participation rates and average quiz scores against the individual quiz records. The dashboard correctly distinguished current weekly quiz completion (50%, 4/8 employees) from historical participation (100%, 8/8 employees). The overall average quiz score was also consistent with the eight completed quiz sessions (71.875%, displayed as 72%).

**7) Invalid Inputs**

| Test Scenario | Expected Results | Actual Results |
|---|---|---|
| Invalid Employee ID | Reject unauthorized or unrecognized employee IDs. | The system displayed an error message and prevented access to the Employee Portal. |
| Empty Employee ID | Handle missing required information. | The system displayed a validation message and prevented login with an empty field. |
| Duplicate Clock-In / Clock-Out | Prevent duplicate attendance actions during an active shift. | The system prevented duplicate clock-in and preserved the original timestamp with an error message. |
| Clock-Out Without Clock-In | Prevent invalid attendance records. | The system disabled clock-out or displayed an appropriate message when no active shift existed. |
| Previous Missing Clock-Out | Identify incomplete attendance records and require employees to resolve them before starting a new shift. | The system displayed a "Missing Clock-Out Action Required" message and listed previous incomplete attendance records. |
| Incomplete Manual Clock-Out Time | Prevent employees from confirming a missing clock-out record when required time information is incomplete. | The system displayed a validation message when AM/PM was not selected and prevented submission. |
| Invalid Manual Clock-Out Time | Reject a clock-out date or time earlier than the original clock-in timestamp. | The system rejected the invalid clock-out time and prevented the attendance record from being updated. |
  

**8) Mobile display testing**: test the application under mobile screen

**Expected results**: the application should adjust to a smaller screen size while keeping the test, buttons, and main functions accessible and easy to use

**Actual results**: the application displayed correctly and worked well under mobile screen with keeping the main functions accessible and visible well.

**9) Weekly quiz results**: verify the accuracy of quiz score calculation

**Expected results**: calculate quiz scores based on correct answers under time limit

**Actual results**: 2 correct answers out of 4 were displayed as 50%

**10) Training recommendations**: verify that quiz performance leads to appropriate training recommendations

**Expected results**: training recommendations should be based on learning % from completed mandatory quizzes without being affected by optional quiz reward points.

**Actual results**: the system displayed training recommendations based on their scores performance and identified areas where additional learning support may be needed.

**11) Missing clock out correction testing**: verify that employees can correct incomplete attendance records and that the system prevents invalid clock out entries

**Expected results**: the system should identify missing clock out records, allow employees to enter their actual clock out date and time, reject invalid inputs, and save corrected attendance records accurately.

**Actual results**:the system displayed previous missing clock out records and allowed employees to select their actual clock out date and time. When AM/PM was missing or the selected clock out time was “earlier” than the original clock in time, the system displayed an error message and prevented submission. When valid information was entered, the corrected attendance record was successfully saved.

**12) Data Persistence**: verify employee records and information remain saved and consistent after refreshing the webpage or logging out and logging in.

**Expected results**: previously saved employee information should remain available and unchanged after refreshing or logging back in.

**Actual results**: we tested data persistence by refreshing the webpage and logging out and logging back in. The previous saved information remained available and consistent.

**13) External user testing**: 
Test participation: an individual from outside the team (an employee) tested the system and provided feedback based on their experience.

Test tasks: an individual external to the team tested the system answering the quiz and answer an optional quiz

Expected results: the user should be able to complete the main function without stey by sten guidance. The application should also provide clear instructions, display accurate results, and be easy to navigate.

Actual results: the system is easier to understand and log in to answer the quiz tested by an external user 

User feedback: the user told us that the home screen allows for easy interaction for employees; they can easily access the system by entering their identification. Once in the system, the instructions for completing the quizzes are clear. It is easy to understand how the app works, read the results in the summary table-which includes arrival and departure times and points-and see the points required to earn benefits.

**14) Regression testing**: verify the improvements made to the application did not affect the existing main functions and the system keeps work well and reliably after updates

**Expected results**: employee login, attendance tracking, weekly quizzes, learning results, reward points, manager dashboard, and the hide/ show option when they type their ID for logging in or out should continue work correctly after improvements. 

**Actual results**: During regression testing, we found that manager ID show/ hide options were not available when login page. We instructed the AI studio to update the manager login page to include the same function as well like employees..

**Retesting**: after the update, we confirmed that the show/ hide option would work correctly on both sides.

**4. Improvements:**
1) Revised the L&D policy
To clarify reward eligibility and ensure that optional quiz participation, it remains separate from attendance and performance evaluation:
Our initial system allowed employees to participate in optional weekly quizzes. However, employees who missed three consecutive quizzes were required to complete a mandatory catch-up quiz. During our group discussion, we realized that this could be confusing because the system described quizzes as optional but later required mandatory participation. Based on our discussion, we decided to revise the quiz participation policy to make the expectations clearer while maintaining flexibility for employees.
Weekly Quiz: Employees are required to complete one quiz per week. Additional quizzes remain optional.
3 Consecutive Missed Weekly Quizzes: The system will provide a short survey asking employees why they have not participated, such as heavy workload, lack of time, technical difficulties, or irrelevant quiz content. The manager will also receive a notification.
5 Consecutive Missed Weekly Quizzes: The system will notify the manager to arrange a supportive check-in with the employee to understand the issue and discuss possible learning support.
Catch-Up Policy: Employees will not automatically be required to complete all missed quizzes by a fixed deadline. Any catch-up plan will depend on the employee's situation.
This revised policy establishes clearer participation requirements while allowing employees to complete additional quizzes voluntarily. It also helps managers identify barriers to learning rather than simply tracking missed quizzes. The change reflects our team's feedback and human oversight in improving the system's business logic and employee learning experience.

2) Improved employee login and invalid input handling
During our review of the employee login and attendance functions, we noticed that the application should handle missing or invalid inputs more clearly. Without proper validation, employees may become confused or the system may create inaccurate records. 
Based on our review, we made the following improvements:
Empty employee ID: display a clear error message when an employee attempts to log in without entering an ID
Invalid employee ID: prevent access when unrecognized employee ID is  detected
Employee ID visibility: provide a show or hide option so employees can check their entered ID before continuing
Invalid clock in/out actions: prevent employees from clocking again during an active shift or clocking out when no active shift exists

We focused on these situations because the application should work reliably even when users make mistakes. Clear validation messages can help employees correct their inputs without needing assistance from a manager. 

3) Improving manager dashboard and reporting accuracy
During our review of the manager portal, we noticed that some summary statistics were difficult to compare with individual employee records. For instance, the overall quiz participation rate did not clearly distinguish between employees who had previously completed a quiz and those who had completed the current required weekly quiz. This could lead managers to misunderstand employee participation. Based on our review, we made the following improvements:
Quiz participation: separate historical participation from current weekly quiz completion
Knowledge performance: evaluate employees based on their actual quiz results rather than participation frequency
Evaluation period: use the average score of completed required weekly quizzes over the most recent four weeks to identify potential learning needs.
Insufficient data: display as ‘not yet assessed’ when employees have not completed any quizzes instead of assuming they need additional training
Missed quiz follow up: use missed quizzes to identify possible participation barriers and offer support rather than automatically assigning training
Personalized training: recommend foundational training for scores below 60% targeted refreshed training for 60-79%, and advanced learning or knowledge for 80-100%

| Quiz Score Accuracy (Based on 4 Weeks Result) | Status | Recommendation |
|---|---|---|
| 0–59% | Needs training | Foundational training |
| 60–79% | Refresher recommended | Targeted refresher |
| 80–100% | Proficient | Advanced learning / knowledge maintenance |
| Lack of sample | Insufficient data | More participation needed |

We chose this approach because quiz participation and knowledge performance represents different aspects of employee development. Separating them allows managers to identify potential knowledge gaps more fairly while respecting employees’ work responsibilities. It can also support our main goal of encouraging continuous learning without unnecessarily disrupting workplace productivity. 

4) Improvement attendance tracking and accuracy
During our review of the employee portal, we noticed several issues with attendance tracking. For instance, when an employee clocked in and out without a few seconds, the system displayed as “Punctual”. We also noticed that some attendance records showed “Missing clock out” and certain punctuality statuses did not clearly reflect the employees’ scheduled working hours. Based on these observations and group discussion, we made the following improvements:
Shift duration: display “Less than 1 minute” when employees work for less than one minute
Clock in and out: prevent duplicate clock in and out without an active shift or previous records were appropriate recorded
Punctuality status: calculate punctuality based on employee’s scheduled start times
Attendance history: clearly distinguish completed shifts, active shifts, and missing clock out records
Data accuracy: ensure attendance records remain accurate and consistent after refreshing the webpage or logging out and logging back in.

We focused on these improvements because inaccurate attendance records could affect how managers review employee punctuality and working hours. By improving the accuracy of attendance tracking, our system can provide more reliable information for both employees and managers while reducing confusion caused by incomplete or missing records.


**5) Separation of the Learning results from Reward results**
We separated the quiz results into two measures: 
Learning score : Based only on mandatory weekly quizzes. 
Reward points: Includes points from mandatory quizzes plus eligible optional- quiz bonuses. 

Why we improved? 
A combined score could make someone look more knowledgeable simply because they completed extra quizzes. Separating the measures gives managers a consistent way to assess employees’ understanding while still rewarding extra participation. 

How we improved ?
Optional quiz bonuses increase the employee’s reward points but do not change their learning percentage. 

For instance: 

| Employee's Activity | Learning Score | Reward Points |
|---|---|---|
| Scores 8/10 on the mandatory quiz | 80% | 8 |
| Then earns 5 eligible optional-quiz points | Still 80% | 13 |

Separating learning scores from reward points makes the results clearer and more consistent. Managers can use mandatory quiz results to identify possible training needs, while employees still receive recognition for completing optional quizzes. This supports continuous learning without allowing extra participation to inflate an employee’s learning score. 

**5. Limitations:**

**1) The system does not assess the employees' level of knowledge**: an assessment that would allow for the selection of questions tailored to their current competence and progress over time, enabling the quizzes to become progressively more difficult. They do not establish the overall work quality or productivity of an employee. 

**2) Employee authentication and data privacy**: the current application uses Employee IDs for login/ out: a real workplace system would require stronger authentication and access controls to protect employee’s personal information like two-factor authentication. 

**3) Real world testing**: the application has not yet tested with a large number of employees in the actual workplace. Further testing would be necessary to evaluate system reliability, usability, and how well the application supports employees with different work schedules and workloads.

**4) Attendance accuracy**: although we improved the attendance functions, additional testing is needed to ensure that working hours and punctuality are calculated correctly under different work schedules. More testing would be also required for unusual situations such as incomplete attendance records and very short shifts.

**5) Reward points and benefit redemption**: although we confirmed that reward points accumulated correctly for one employee, further testing is needed whether points deductions work and benefit redemption across multiple employees. The eligibility and tax treatment of employee benefits would also require review before real world implementation. Rewards such as paid time off also create costs for the company, especially if many employees redeem them. 

**6. AI use and contributions:**
We used Google AI Studio to build our system. We found the tool easy to use while we are not expert in coding or making application; while our initial idea was sound, we had to iteratively refine our prompts-becoming increasingly specific about the changes we wanted-to achieve the best possible presentation of the application, ensure it was intuitive to use, and effectively structure the breakdown of results for both employees and managers. Each team member contributed ideas for improving the system and tested it following every update. Before using any prompts with the AI, we shared them among the group to review and make necessary adjustments. We found that the ease of using this tool facilitated the rapid development of our application; however, each time we tested it, we identified areas for improvement. Consequently, building a system for an organization-one that is accurate-requires more time for testing and refinement to achieve the desired outcome.

**Group decisions and contribution**: Our group made decisions about the application’s functions and business rules rather than relying entirely on AI suggestions.

**1) Quiz participation policy**: employees are required to complete one mandatory quiz per week, with the option to take additional quizzes throughout the rest of the month.

**2) Learning score and reward points**: learning score is solely based on the mandatory weekly quizzes while reward points include both the mandatory quizzes and the optional-quiz bonuses. 

**3) Attendance tracking**: we tested manually clock in and out functions and identified some issues that short shift durations and attendance statuses that require further verification.

**4) Quiz score calculation**: we checked quiz results against the number of correct answers to verify the score calculations. We also identified the need for consistent training recommendations based on the actual quiz performance.

**5) Reward point accumulations**: we tested the reward system using one employee and confirmed that newly earned points were added to the employee’s existing point balance. 

**6) Manager dashboard**: we compared the dashboard statistics with individual quiz records. We verified that current quiz completion was 50% (4/8), historical participation was 100% (8/8), and the overall average quiz score was 72%.

These contributions helped us a lot improve the application’s business logic and reliability while ensuring that important decisions and verification remained under our group’s control.

**Applications**

**Getting started** 
Our Employee Learning & Development Management System allows employees to record attendance, complete department-specific quizzes, and track their learning progress and reward points. Managers can review these records to identify learning needs and provide support.
For Employees
1. Access your employee portal
Enter the employee ID provided to you and select “Let’s Get Started.” If an error appears, check that your ID is correct and that the field is not empty.

2. Clock in
Clock in when your shift begins. The system records your arrival time and displays your attendance status. You cannot clock in again while you already have an active shift.

3. Complete your mandatory weekly quiz
Complete one mandatory quiz each week. Questions are based on your assigned department.
Answer the questions and submit your responses to view your result. Mandatory quiz results contribute to your learning percentage and reward points.

4. Choose whether to attempt the Monthly BONUS Quiz
You can choose to attempt one optional bonus quiz per month to earn additional reward points.
Participation is voluntary.
Only one optional bonus quiz can be attempted each month.
Bonus points increase your reward balance.
The optional quiz does not change your learning percentage.
Taking the optional quiz does not replace your mandatory weekly quiz.

5. Understand your results

| **Measure** | **What it means** |
|---|---|
| Weekly quiz completion | Whether you have completed the required quiz for the current week. |
| Learning percentage | Your average score from completed mandatory weekly quizzes over the most recent four weeks. Optional quizzes are excluded. |
| Reward points | Points earned from mandatory quizzes plus eligible monthly optional-quiz bonuses. |

If you have not completed any mandatory quizzes during the evaluation period, your learning status will show “Not yet assessed.”
Example: Using illustrative point values, assume an employee has completed one mandatory quiz and has no previous reward points.

| **Employee's Activity** | **Learning Percentage** | **Reward Points** |
|---|---|---|
| Scores 8/10 on the mandatory quiz and earns 8 points | 80% | 8 |
| Attempts the optional monthly bonus quiz and earns 5 additional points | Still 80% | 13 |

If the employee chooses not to attempt the optional quiz, their learning percentage remains 80% and their reward balance remains 8 points.

6. Respond to reminders and support messages
If you miss a mandatory weekly quiz, the system provides a reminder.
After three consecutive missed quizzes: An optional support survey asks about barriers such as workload, scheduling, or technical difficulties. Your manager receives a notification.
After five consecutive missed quizzes: Your manager is notified to arrange a supportive check-in.
Use these opportunities to explain any difficulties and discuss a manageable learning plan. You are not automatically required to complete every missed quiz by a fixed deadline.

7. Clock out
Clock out when your shift ends to complete your attendance record. Attendance is recorded separately from quiz performance, so a low quiz score does not change your attendance record

8. Correct a missed clock-out
If you forget to clock out, the attendance section will display “Missing Clock-Out Action Required.”
To complete the record:
Find the affected shift using its original clock-in date and time.
Select the actual date and time you finished that shift, including the correct AM or PM. Enter when you stopped working, not the time you are making the correction.
Select “Review & Confirm Clock-Out.”
Provide a reason explaining why you missed the clock-out, such as forgetting during a busy shift.
Review your details and confirm the correction.
Complete any outstanding clock-out records before starting a new shift. This feature allows you to correct an incomplete attendance record while documenting the reason for the manual entry.
.
For Managers
1. Open the Manager Portal
Select “Manager Portal” to access employee attendance, quiz participation, learning results, training recommendations, and benefit claims.

2. Review attendance records
Check employees’ clock-in and clock-out records, punctuality, and shift status.
Follow up on incomplete shifts. Employees who forget to clock out can enter their actual finishing date and time and provide a reason for the missed clock-out.

3. Review department participation and learning
Use the “Departmental L&D Performance & Participation Matrix” to understand each department’s results.

| **Dashboard Measure** | **How to Interpret It** |
|---|---|
| **Eligible / Total** | Employees eligible for the weekly requirement compared with the department's total staff. |
| **Ever Participated** | Employees who have previously completed a quiz. |
| **Weekly Required** | Eligible employees who have completed the current week's mandatory quiz. |
| **Learning Percentage** | Marks earned divided by possible marks from mandatory quizzes, multiplied by 100. Optional quizzes are excluded. |
| **Reward Points** | Points from mandatory quizzes and eligible monthly optional bonuses. |
| **Highest Mastery Area / Lowest Scoring Topic** | Assessed topics showing stronger understanding or possible learning gaps. |

 
For example, 9 marks out of 12 = 75% learning. A department can have 100% historical participation while only 50% have completed this week’s quiz.
Use “Configure Eligible Staff” to review which employees should be included in the weekly requirement.

4. Review individual training recommendations
Open “Individual Employee Training Recommendations” to review each employee’s mandatory quiz results, number of completed quizzes, learning percentage, and weekly participation status.


| **Learning Percentage** | **Suggested Support** |
|---|---|
| Below 60% | Foundational training |
| 60% to below 80% | Targeted refresher training |
| 80%–100% | Advanced learning or knowledge maintenance |
| Not yet assessed | Obtain assessment information and check for participation barriers |
 

Consider how many quizzes support the result. One completed quiz provides limited evidence of an employee’s understanding.
Review missed quizzes separately from learning scores. After three consecutive missed required quizzes, review any support-survey response. After five, arrange a supportive check-in.

5. Check reward points and monthly bonus eligibility
The reward section indicates whether an employee’s monthly bonus is available or has been used.
“Monthly bonus open” means the monthly bonus opportunity remains available.
“1/1 monthly bonus used” means the employee has used that month’s optional bonus attempt.
Additional optional practice sessions may appear in the records with 0 reward points.
Optional quizzes do not change learning percentages. Review reward points separately when making training decisions.

6. Review company-wide learning trends
Use “Company-Wide Learning Percentage Over Time” to review daily mandatory-quiz results over the displayed seven-day period.
Check the number of sessions behind each daily percentage. Changes in the company average may reflect different participants or questions and do not automatically demonstrate individual improvement.
Use “Underlying Completed Quiz Sessions” and select “Review” to inspect a session. Check whether it is labelled mandatory, monthly bonus, or practice only.

7. Review benefit claims
Open “Benefit Claims & Fulfillment Queue” and check the employee, requested benefit, selection basis, points, and status.
Distinguish between point-based claims and top-performer awards. An award may display 0 points because it was awarded through recognition.
For a pending request, review the details and select “Approve Perk” when appropriate. Check the recorded status afterward and coordinate delivery of the approved benefit.
