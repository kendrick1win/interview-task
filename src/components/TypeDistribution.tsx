import { useState, useEffect } from "react";

interface DistributionData {
    type: string;
    percentage: number;
    count: number;
}

interface AnalysisData {
    total_tickets: number;
    type_distribution: DistributionData[];
}

export function TypeDistribution() {
    const [data, setData] = useState<AnalysisData | null>(null);

    // Fetch the data from analysis.tsx
    useEffect(() => {
        fetch("/api/analysis")
            .then((res) => res.json())
            .then(setData);
    }, []);

    // Loading before data is loaded
    if (!data) return <div>Loading...</div>;

    // visualise data
    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Ticket Type Distribution</h2>
            <p className="mb-4">Total Tickets Analyzed: {data.total_tickets}</p>

            <div className="space-y-4">
                {data.type_distribution.map(({ type, percentage, count }) => (
                    <div key={type} className="border-b pb-2">
                        <div className="flex justify-between items-center">
                            <span className="font-medium capitalize">
                                {/* type */}
                                {type}
                            </span>
                            <div className="text-right">
                                {/* count */}
                                <div>{count} tickets</div>
                                <div className="text-gray-600">
                                    {/* percentage */}
                                    {percentage.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                        {/* Visual percentage bar */}
                        <div className="w-full bg-gray-200 h-2 mt-2 rounded">
                            <div
                                className="bg-blue-500 h-2 rounded"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
