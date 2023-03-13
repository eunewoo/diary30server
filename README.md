# diary30server
Really short-time video of running project <a></a>.

Summary: backend server side of diary30 project and clouded in Firebase, Atlas. Images are stored in Cloudinary.

Language use: Node.js

Database use: MongoDB 

# Running manual

Go to <a>https://diary30woo.web.app/</a> (Deployed client side version)

Login with sample user

ID: sample123

PWD: Sample123

# Code explanation
- Recent completed and deployed version is in "RecentDeploy" branch 

- 'Server' folder contains both normal localhost server for testing and 'funcitons' folder as containing deployment 

- 'Main' branch is in progress of adapting session 

# DB explanation
- Two kinds of DB type is formed. users and questions.

- users contain user_id, password(hashed). user_name, user_email, address_f, address_i and img.

- questions contain user_id(reference), question, question_selection, question_type, question_answers and question_order. 

# Timeline
2022.9 : Start project as CSE316(Software Engineering) Final project with two other members

2022.12 - 2023.3 : Develop project with Deploy, DB from mySQL to MongoDB Change logic, Catch bug, Collect user data, Componentize backend during winter break

# Deploy manual
1. Download zip file of branch "RecentDeploy" NOT "main" branch

2. Type 'npm install' command after go into 'functions' folder 

3. Type 'firebase deploy --only functions' at 'server' folder







