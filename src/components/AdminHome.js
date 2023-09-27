import { adminHomeFields } from "../constants/formFields";
import { useState, useEffect } from 'react';
import FormAction from "./FormAction";
import Input from "./Input";

const fields = adminHomeFields;
let fieldsState = {};
fields.forEach(field => fieldsState[field.id] = '');

export default function AdminHome() {
    const [loginState, setLoginState] = useState(fieldsState);
    const [showSuccessFlashMessage, setShowSuccessFlashMessage] = useState(false); // State to control flash message visibility
    const [showFailFlashMessage, setShowFailFlashMessage] = useState(false); // State to control flash message visibility
    const [text, setText] = useState(""); // Declare text as a state variable
    const [availableQuestionCount, setAvailableQuestionCount] = useState("");


    const fetchAvailableQuestionCount = async () => {
        try {
            const response = await fetch("/available_question_count");
            console.log("1")
            if (response.status === 200) {
                const data = await response.json();
                console.log(data)
                // const availableQuestionCount = data.available_question_count;
                setAvailableQuestionCount(data.available_question_count);
                // Do something with the availableQuestionCount, e.g., update state.
            } else {
                console.error("Error: Failed to fetch available_question_count");
            }
        } catch (error) {
            console.error("Error: An error occurred while fetching available_question_count", error);
        }
    };

    useEffect(() => {
        fetchAvailableQuestionCount();
    }, []);

    const handleChange = (e) => {
        setLoginState({ ...loginState, [e.target.id]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting the number of questions");

        const quesNumber = parseInt((document.getElementById("quesNumber")).value);
        console.log(quesNumber);

        try {
            // Send a POST request to the `/submit_number` route
            const response = await fetch("/submit_number", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numberInput: quesNumber }),
            });

            if (response.status === 200) {
                console.log("Success: Selected questions successfully");
                setText("Selected questions successfully");
                setShowSuccessFlashMessage(true);

                // Reset the form
                resetForm();

                // Hide the success flash msg after 3 seconds
                setTimeout(() => {
                    setShowSuccessFlashMessage(false);
                }, 3000);
                fetchAvailableQuestionCount();
                console.log("Success")
            } else {
                console.error("Error: Failed to send JSON response to API app");
                setText("Failed to send JSON response to API app");
                setShowFailFlashMessage(true);
            }
        } catch (error) {
            console.error("Error: An error occurred", error);
            setText("An error occurred");
            setShowFailFlashMessage(true);
        }
    };

    const resetForm = () => {
        const loginState = {};
        fields.forEach(field => loginState[field.id] = '');
        setLoginState(loginState);
    };

    const handleUserRegButton = () => {
        window.location.href = '/userregistration';
    }

    const handleDashboardButton = () => {
        window.location.href = '/dashboard';
    }

    const handleLogoutButton = () => {
        window.location.href = '/';
    }

    const handleResetButton = async () => {
        try {
            // Send a POST request to the `/api/reset_question_flags` endpoint
            const response = await fetch("/reset_question_flags", {
                method: 'POST',
            });

            if (response.status === 200) {
                console.log("Success: Question flags reset successfully");
                setText("Question flags reset successfully");
                setShowSuccessFlashMessage(true);
                setTimeout(() => {
                    setShowSuccessFlashMessage(false);
                }, 3000);

            } else {
                console.error("Error: Failed to reset question flags");
                setText("Failed to reset question flags");
                setShowFailFlashMessage(true);
                setTimeout(() => {
                    setShowFailFlashMessage(false);
                }, 3000);
            }
        } catch (error) {
            console.error("Error: An error occurred while resetting question flags", error);
            setText("An error occurred while resetting question flags");
            setShowFailFlashMessage(true);
            setTimeout(() => {
                setShowFailFlashMessage(false);
            }, 3000);
        }
    };

    return (
        <div>
            {showSuccessFlashMessage && (
                <div id="successFlashMsg">
                    {text}
                </div>
            )}
            {showFailFlashMessage && (
                <div id="failFlashMsg">
                    {text}
                </div>
            )}

            <div className="flex justify-center mt-4">
                <button className="group relative flex py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" onClick={handleUserRegButton}>
                    User Registration
                </button>
                <button className="group relative flex py-2.5 px-9 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ml-10" onClick={handleDashboardButton}>
                    Dashboard
                </button>
            </div>

            <br /><br />

            <form className="mt-4 space-y-6" onSubmit={handleSubmit} id="inputForm">
                <div className="-space-y-px">
                    {fields.map(field => (
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={loginState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                        />
                    ))}
                </div>

                <FormAction handleSubmit={handleSubmit} text="Submit" />
            </form>

            <div className="mt-2 text-center text-sm text-gray-600 mt-5">
                Number of questions remaining: <span>{availableQuestionCount}</span> <br />
                <button onClick={handleResetButton} className="font-medium text-purple-600 hover:text-purple-500 mt-2 text-center text-sm mt-5">
                    RESET Flags
                </button>
            </div>

            <br />

            <div>
                <center>
                    <button className="group relative flex py-2 px-9 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4" onClick={handleLogoutButton}>
                        Logout
                    </button>
                </center>
            </div>

        </div>
    )
}