import axios from "axios";
import { Request, Response } from "express";
import { SampleData } from "./types";

const DATA_URL = "https://sampleapi.squaredup.com/integrations/v1/service-desk";

export const GET = async (req: Request, res: Response) => {
    try {
        const { data } = await axios.get<SampleData>(DATA_URL, {
            params: {
                datapoints: 100,
            },
        });

        if (!data || !data.results) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        // Sort by priority (high -> normal -> low)
        const sortedIssues = data.results.sort((a, b) => {
            const priorityOrder: Record<string, number> = {
                high: 0,
                normal: 1,
                low: 2,
            };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        res.json(sortedIssues);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
};
