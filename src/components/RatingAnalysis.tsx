import { useState, useEffect } from "react";

interface RatingData {
    longest_resolution_time: string;
    satisfaction_score: string;
    ticket_id: string;
}

export function RatingAnalysis() {
    const [data, setData] = useState<RatingData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/rating-analysis")
            .then((res) => {
                if (!res.ok)
                    throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(setData)
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="text-red-600 font-medium">
                    Failed to load data: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
                Longest Resolution Ticket
            </h2>
            <div className="space-y-4">
                <div className="flex flex-col">
                    <span className="text-3xl font-bold text-blue-600">
                        {data?.satisfaction_score}
                    </span>
                    <span className="text-gray-600">Satisfaction Rating</span>
                </div>
                <div className="text-sm text-gray-600">
                    <p>
                        Resolution Time: {data?.longest_resolution_time} hours
                    </p>
                    <p>Ticket ID: {data?.ticket_id}</p>
                </div>
            </div>
        </div>
    );
}
