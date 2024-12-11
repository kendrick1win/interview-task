import axios from "axios";
import { Request, Response } from "express";
import { SampleData } from "./types";

interface Metrics {
    byPriority: Record<string, number>;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    bySatisfaction: Record<string, number>;
    total: number;
}

const DATA_URL = "https://sampleapi.squaredup.com/integrations/v1/service-desk";

// GET function for GET request.
export const GET = async (req: Request, res: Response) => {
    // try block to fetch the data.
    try {
        const { data } = await axios.get<SampleData>(DATA_URL, {
            params: { datapoints: 500 },
        });

        const initialMetrics: Metrics = {
            byPriority: {},
            byType: {},
            byStatus: {},
            bySatisfaction: {},
            total: data.results.length,
        };

        // To update the metrics
        const metrics = data.results.reduce((acc: Metrics, ticket) => {
            acc.byPriority[ticket.priority] =
                (acc.byPriority[ticket.priority] || 0) + 1;
            acc.byType[ticket.type] = (acc.byType[ticket.type] || 0) + 1;
            acc.byStatus[ticket.status] =
                (acc.byStatus[ticket.status] || 0) + 1;

            const rating = ticket.satisfaction_rating?.score || "unrated";
            acc.bySatisfaction[rating] = (acc.bySatisfaction[rating] || 0) + 1;

            return acc;
        }, initialMetrics);

        // To send metrics as a JSON response.
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch metrics" });
    }
};
