import { useState, useEffect } from "react";
import { SampleData } from "../api/types";

export function IssuesList() {
    const [issues, setIssues] = useState<SampleData["results"]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch the data
    useEffect(() => {
        fetch("/api/issues-list")
            .then((res) => {
                if (!res.ok)
                    throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                // Update issues
                setIssues(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="text-red-600 font-medium">
                    Failed to load issues: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            {/* h2 for the title of this component */}
            <h2 className="text-xl font-bold mb-4">Issues List</h2>
            <div className="space-y-4">
                {issues.map((issue) => (
                    <div
                        key={issue.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                {/* Description inside component */}
                                <h3 className="font-medium">{issue.subject}</h3>
                                <p className="text-sm text-gray-600">
                                    Organization: {issue.organization_id}
                                </p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                    issue.priority === "high"
                                        ? "bg-red-100 text-red-800"
                                        : issue.priority === "normal"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-green-100 text-green-800"
                                }`}
                            >
                                {issue.priority}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
