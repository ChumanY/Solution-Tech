import React from "react";

interface ErrorAlertProps {
    fileError: string;
    alertVisible: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ fileError, alertVisible }) => (
    fileError ? (
        <div className={`fixed left-1/2 top-8 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-500 ${alertVisible ? "opacity-100" : "opacity-0"}`}>
            {fileError}
        </div>
    ) : null
);

export default ErrorAlert;
