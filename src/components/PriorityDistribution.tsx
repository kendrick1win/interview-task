import { useState, useEffect } from "react";

interface PriorityData {
    priority: string;
    percentage: number;
    count: number;
}

export function PriorityDistribution() {
    const [data, setData] = useState<{
        total_tickets: number;
        priority_distribution: PriorityData[];
    } | null>(null);

    useEffect(() => {
        fetch("/api/priority-analysis")
            .then((res) => res.json())
            .then(setData);
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Priority Distribution</h2>
            <p className="mb-4">Total Tickets: {data.total_tickets}</p>

            <div className="space-y-4">
                {data.priority_distribution.map(
                    ({ priority, percentage, count }) => (
                        <div key={priority} className="border-b pb-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium capitalize">
                                    {priority}
                                </span>
                                <div className="text-right">
                                    <div>{count} tickets</div>
                                    <div className="text-gray-600">
                                        {percentage.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 h-2 mt-2 rounded">
                                <div
                                    className={`h-2 rounded ${
                                        priority === "high"
                                            ? "bg-red-500"
                                            : priority === "normal"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
