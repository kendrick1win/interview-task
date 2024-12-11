import { useState, useEffect } from "react";

interface Metrics {
    byPriority: Record<string, number>;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    bySatisfaction: Record<string, number>;
    total: number;
}

export function HighLevelView() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // To fetch the data from endpoint /api/highlevel.
    useEffect(() => {
        fetch("/api/high-level")
            .then((res) => {
                if (!res.ok)
                    throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(setMetrics)
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    // To set priority color accordingly.
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "text-red-600";
            case "normal":
                return "text-blue-600";
            case "low":
                return "text-green-600";
            default:
                return "text-gray-600";
        }
    };

    // To set status color accordingly.
    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return "text-yellow-600";
            case "closed":
                return "text-green-600";
            default:
                return "text-gray-600";
        }
    };

    // Card to display the information.
    const MetricCard = ({
        title,
        data,
        colorFn = () => "text-gray-600",
    }: {
        title: string;
        data: Record<string, number>;
        colorFn?: (key: string) => string;
    }) => (
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            {/* H3 for the title */}
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {title}
            </h3>
            <div className="space-y-3">
                {Object.entries(data).map(([key, value]) => (
                    <div
                        key={key}
                        className="flex justify-between items-center"
                    >
                        <span
                            className={`capitalize font-medium ${colorFn(key)}`}
                        >
                            {key}
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    // To display loading while the data is being fetched.
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
            </div>
        );
    }

    // To handled fetching errors.
    if (error) {
        return (
            <div className="text-red-600">Failed to load metrics: {error}</div>
        );
    }

    // To display the cards.
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Issues by Priority"
                    data={metrics?.byPriority || {}}
                    colorFn={getPriorityColor}
                />
                <MetricCard
                    title="Issues by Type"
                    data={metrics?.byType || {}}
                />
                <MetricCard
                    title="Issues by Status"
                    data={metrics?.byStatus || {}}
                    colorFn={getStatusColor}
                />
                <MetricCard
                    title="Issues by Satisfaction"
                    data={metrics?.bySatisfaction || {}}
                />
            </div>
        </div>
    );
}
