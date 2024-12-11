import axios from "axios";
import { Request, Response } from "express";
import { SampleData } from "./types";

const DATA_URL = "https://sampleapi.squaredup.com/integrations/v1/service-desk";

// Fetch the data
export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL, {
        params: {
            datapoints: 500,
        },
    });

    // Calculate priority distribution from (data.results - results array)
    const priorityDistribution = data.results.reduce((acc, ticket) => {
        // Maps ticket's priority to frequency count
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Convert to array of mapped percentages
    // i.e { priority: "High", percentage: 24, count: 120 }
    const total = data.results.length;
    const percentages = Object.entries(priorityDistribution).map(
        ([priority, count]) => ({
            priority,
            percentage: (count / total) * 100,
            count,
        })
    );

    // sends response in JSON format
    res.json({
        total_tickets: total,
        priority_distribution: percentages,
    });
};
