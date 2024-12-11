import { useState, useEffect } from "react";

interface ResolutionData {
    total_high_priority: number;
    average_resolution_time: number;
    resolution_time_hours: string;
}

export function ResolutionTimeAnalysis() {
    const [data, setData] = useState<ResolutionData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/resolution-analysis")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setData(data);
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
                <div className="animate-pulse flex space-y-4 flex-col">
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
                High Priority Resolution Time
            </h2>
            <div className="space-y-4">
                <div className="flex flex-col">
                    <span className="text-3xl font-bold text-blue-600">
                        {data?.resolution_time_hours} hours
                    </span>
                    <span className="text-gray-600">
                        Average Resolution Time
                    </span>
                </div>
                <div className="text-sm text-gray-600">
                    Based on {data?.total_high_priority} high priority tickets
                </div>
            </div>
        </div>
    );
}
