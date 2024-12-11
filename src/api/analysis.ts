import axios from "axios";
import { Request, Response } from "express";
import { SampleData } from "./types";

const DATA_URL = "https://sampleapi.squaredup.com/integrations/v1/service-desk";

export const GET = async (req: Request, res: Response) => {
    // GET 500 a sample of 500 data points of typw <SampleData> (request, response)
    const { data } = await axios.get<SampleData>(DATA_URL, {
        params: {
            datapoints: 500,
        },
    });

    // Calculate type distribution using the results array
    const typeDistribution = data.results.reduce((acc, ticket) => {
        const type = ticket.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    // Result - a map of <type: amount>

    // Convert to percentages
    const total = data.results.length;
    const percentages = Object.entries(typeDistribution).map(
        ([type, count]) => ({
            type,
            percentage: (count / total) * 100,
            count,
        })
    );

    res.json({
        total_tickets: total,
        type_distribution: percentages,
    });
};
