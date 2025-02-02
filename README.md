Inspiration

Our inspiration came from the ALS Ice Bucket Challenge from a few years ago. It was fascinating as it started with 2 individuals who wanted to raise awareness for a great cause they were passionate about. They nominated a few of their friends to do it and within a short period of time, this snowballed into a viral global trend. As a result, celebrities, athletes, world leaders, and millions of others took part. Our interest lies in this chain of nominations that led to this rapid spread. We want to replicate this more and visualise it. Inspired by this ripping effect, we explore this idea for our hackathon project.

What it does

Users of the app are encouraged to do a good deed: pay for someone’s coffee, help the elderly, make a donation to charity, everything, and anything that promotes good. Let’s take the example that you helped Mrs. Lee cross the street one day—that’s a ripple. You log your ripple on the app and at the same time, send out waves (or nominations) to a few friends to do the same! They get your requests, mark their ripples as complete, and then send their waves out to another three friends. Sooner or later, you have a current—a chain of good deeds branching out from the one simple act of kindness you did initially. As a bonus, you can link your ripple to a charitable cause that you are passionate about to further compound the positive effect!

How we built it

We built our app using React with TypeScript for the frontend and Firebase for the backend. This allowed us to move quickly without needing a dedicated backend.

Frontend: React made it easy to create a smooth, interactive UI, and TypeScript helped catch errors early. We designed the layout in Figma to ensure a clean and user-friendly experience.
Backend: We used Firebase Firestore to store challenges, Firebase Authentication for user sign-in, and Firebase Storage for image uploads. Firebase Dynamic Links made it easy to share and track challenges.
How It Works: Users create or join challenges, log their good deeds, and nominate others. The app tracks the entire participation chain in real-time using Firestore, allowing us to visualize how acts of kindness spread.
Challenges We Ran Into

Tracking Nominations: Ensuring the app correctly mapped who nominated whom required careful Firestore structuring to avoid data inconsistencies.
Seamless Sharing: We fine-tuned Firebase Dynamic Links to make it easy for users to share and track participation from external platforms.
Database Design: Since Firestore is a NoSQL database, we had to structure data efficiently to avoid too many joins while keeping queries fast and cost-effective.
Splitting Workload: With limited time, we had to divide tasks smartly—some focused on the UI/UX, while others handled database logic and integrations.
Accomplishments That We're Proud Of

A Fully Working App – We took an idea from concept to reality within a short timeframe.
A Unique Idea with Real Impact – We built a platform that encourages positive actions and lets users visualize their influence.
A Smooth and Scalable System – Using Firebase, we ensured real-time updates and easy scalability with minimal backend management.
What We Learned

The Importance of Clear Communication – Constant team discussions helped align our vision and problem-solving approach.
Planning is Key – Sketching out user flows and database structures early saved us from costly redesigns later.
Optimizing Database Design – Structuring Firestore properly made tracking challenges and nominations more efficient.
What’s Next for Ripple?

Deploy the app to the web so people can start using it beyond the hackathon.
Refine the UI and user experience based on feedback.
Expand sharing features to make nominations even more seamless.
Explore new features like leaderboards and deeper impact tracking.
