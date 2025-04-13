"use client";

import Header from "@/app/components/elements/header";
import AuthProvider, { doneLoading } from "../context/authContext";
import Footer from "../components/elements/footer";
import { LoadingSpinner } from "../components/elements/loadingCircle";

// This is the main page for the about app. It will be displayed when the user navigates to /about-app.
export default function ShowInfoAboutApp() {
  const Render = () => {
    if (!doneLoading) return <LoadingSpinner />;
    return (
      <div className="min-h-screen flex flex-col bg-gray-200 md:text-xl text-black">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex justify-center items-center flex-grow md:text-xl">
          <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md my-8">
            <div className="flex-grow py-10 px-4 space-y-4 text-justify">
              <h1 className="text-3xl font-bold text-center text-gray-800">
                About Flash Cards Learning App
              </h1>
              <p className="text-lg text-center text-gray-700">
                This Flash Cards Learning App is designed to help users improve
                their knowledge and memorization skills in an engaging and
                interactive way. Users can create their own card sets, explore
                sets created by others, and track their progress.
              </p>
              <br />
              <h2 className="text-2xl font-semibold text-gray-800">
                Key Features:
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-lg text-gray-700">
                <li>Sign up via email/password or Google</li>
                <li>Reset your password if you forget it</li>
                <li>
                  Update account details and view your global statistics of
                  learning
                </li>
                <li>Create, explore, and copy card sets from other users</li>
                <li>
                  Create cards with a question and answer, and add one image per
                  account (due to storage limitations - may improve)
                </li>
                <li>
                  Edit and delete your card sets and cards within them and
                  rearrange cards in the set to your liking
                </li>
                <li>
                  Filter through card sets to find the most suitable ones for
                  you
                </li>
                <li>
                  See set statistics to track learning progress for each card
                  set
                </li>
                <li>
                  Choose from three learning modes: Base method (learning one
                  card at a time to memorize), Multiple choice, and True or
                  False
                </li>
              </ul>
              <h2 className="text-2xl font-semibold text-gray-800">
                Why This App?
              </h2>
              <p className="text-lg text-gray-700">
                This web app is part of my bachelor&apos;s thesis project. The
                goal is to provide an efficient, easy-to-use tool for learning
                through flash cards, helping users retain and recall information
                effectively. As part of the thesis, I am working on refining the
                features and ensuring the app functions seamlessly for different
                users on PC and mobile devices. I also need your feedback.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800">
                Test The App And Provide Feedback
              </h2>
              <p className="text-lg text-gray-700">
                I need your feedback to make this app better and to collect
                results for my thesis. You can help by reporting bugs or
                providing insights on how the app works for you. If you
                encounter any bugs or issues, please fill out the bug report
                form. For testing I have created several test scenarios that you
                can follow and see below. You can then report how it worked for
                you in the test report form. Both forms are linked at the end of
                this page.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800">
                Test Scenarios:
              </h2>
              <ul className="list-decimal pl-5 space-y-2 text-lg text-gray-700">
                <li>
                  <strong>Sign-Up and Login</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Test the process of signing up with an email and password
                      or Google.
                    </li>
                    <li>
                      Check if you receive a registration email after signing
                      up.
                    </li>
                    <li>Test logging in with email/password or Google.</li>
                    <li>
                      Test the login process with incorrect credentials and
                      ensure the app handles errors gracefully.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>
                    Reset your password (not needed if signed with Google)
                  </strong>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Test the process of resetting your password via email.
                    </li>
                    <li>
                      Check if you receive a password reset email with a token.
                    </li>
                    <li>
                      Test entering the token and setting a new password
                      successfully.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Account Management</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Test the ability to update account details (email,
                      password or username).
                    </li>
                    <li>
                      Test the process of viewing global user statistics (e.g.,
                      number of cards learned, sets completed).
                    </li>
                    <li>
                      Test the process of logging out and ensuring that the
                      session is properly ended.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Card Set Creation and Management</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Test the process of creating a new card set (including
                      adding a title and description).
                    </li>
                    <li>Test adding a a card to the card set.</li>
                    <li>
                      Test uploading and attaching an image to a card (ensure
                      the app allows only one image per account).
                    </li>
                    <li>
                      Test editing an existing card set (adding, removing,
                      updating cards, or rearranging them).
                    </li>
                    <li>
                      Test deleting a card set and ensure the set is permanently
                      removed.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Exploring and Copying Card Sets</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Test browsing and exploring sets created by other users.
                    </li>
                    <li>
                      Test the ability to copy a card set created by another
                      user into your account.
                    </li>
                    <li>
                      Test filtering card sets based on different aspects (e.g.,
                      your sets, favorite sets, category, etc.).
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Learning Modes</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Test the &quot;Base method&quot; learning mode (learning
                      cards one by one in the set).
                    </li>
                    <li>
                      Test the &quot;Multiple choice&quot; mode and ensure that
                      the options are random and varied.
                    </li>
                    <li>
                      Test the &quot;True or False&quot; mode and ensure the
                      questions and answers are correctly formatted.
                    </li>
                    <li>
                      Test the ability to see set statistics to track progress
                      in each learning mode.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Progress Tracking</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Test the ability to track your progress in each set,
                      including how many cards have been learned.
                    </li>
                    <li>
                      Test the ability to view your global statistics and how
                      they change over time while you learn.
                    </li>
                  </ul>
                </li>
              </ul>
              <p className="text-lg text-gray-700">
                <strong>Important note: </strong>
                Please don&apos;t feel obligated to test all scenarios. However,
                your feedback on as many scenarios as possible would be
                incredibly valuable. Also, please try the app on both PC and
                mobile device if you can.
              </p>
              <p className="text-lg text-gray-700 text-right">
                <strong>Thank you for your help!</strong>
                <br />
                Lukáš Cafourek
              </p>
              <div className="space-y-2 border-t border-gray-300 pt-4 mt-4">
                <p className="text-center">
                  Test Report Form:{" "}
                  <a
                    href={process.env.NEXT_PUBLIC_TEST_REPORT_URL}
                    target="_blank"
                    rel="noopener"
                    className="text-blue-500"
                  >
                    Fill out
                  </a>
                </p>
                <p className="text-center">
                  Bug Report Form:{" "}
                  <a
                    href={process.env.NEXT_PUBLIC_BUG_REPORT_URL}
                    target="_blank"
                    rel="noopener"
                    className="text-blue-500"
                  >
                    Fill out
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  };

  return (
    <AuthProvider>
      <Render />
    </AuthProvider>
  );
}
