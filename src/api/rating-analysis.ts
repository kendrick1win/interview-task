import axios from "axios";
import { Request, Response } from "express";
import { SampleData } from "./types";

const DATA_URL = "https://sampleapi.squaredup.com/integrations/v1/service-desk";

export const GET = async (req: Request, res: Response) => {
    // Try to fetch the data.
    try {
        const { data } = await axios.get<SampleData>(DATA_URL, {
            params: {
                datapoints: 500,
            },
        });

        if (!data || !data.results) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        // Filter the high priority tickets with resolution times
        const ticketsWithResolutionTime = data.results
            .filter((ticket) => ticket.priority === "high")
            .map((ticket) => {
                const created = new Date(ticket.created);
                const updated = new Date(ticket.updated);
                const resolutionTime =
                    (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
                return {
                    ...ticket,
                    resolutionTime,
                };
            });

        // Object to find and store the ticket with longest resolution time (current > longest)
        const longestTicket = ticketsWithResolutionTime.reduce(
            (longest, current) =>
                current.resolutionTime > longest.resolutionTime
                    ? current
                    : longest
        );

        res.json({
            longest_resolution_time: longestTicket.resolutionTime.toFixed(2),
            satisfaction_score:
                longestTicket.satisfaction_rating?.score || "No rating",
            ticket_id: longestTicket.id,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
};
