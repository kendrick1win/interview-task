import axios from "axios";
import { Request, Response } from "express";
import { SampleData } from "./types";

const DATA_URL = "https://sampleapi.squaredup.com/integrations/v1/service-desk";

// GET function to handle HTTP GET requests
export const GET = async (req: Request, res: Response) => {
    // Try fecthing the data - 500 data points, if not then catch error
    try {
        const { data } = await axios.get<SampleData>(DATA_URL, {
            params: {
                datapoints: 500,
            },
        });
        // If invalid format
        if (!data || !data.results) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        // Filter only high priority closed tickets
        const highPriorityTickets = data.results.filter(
            (ticket) => ticket.priority === "high"
        );

        // To prevent NaN
        if (highPriorityTickets.length === 0) {
            return res.json({
                total_high_priority: 0,
                average_resolution_time: 0,
                resolution_time_hours: "0",
            });
        }

        // Calculate resolution time for each ticket
        // i.e [6, 2.5]
        const resolutionTimes = highPriorityTickets
            .map((ticket) => {
                if (!ticket.created || !ticket.updated) {
                    return 0;
                }
                const created = new Date(ticket.created);
                const updated = new Date(ticket.updated);
                return (
                    (updated.getTime() - created.getTime()) / (1000 * 60 * 60)
                );
            })
            .filter((time) => time > 0);

        // Calculate the average time
        const averageResolutionTime =
            resolutionTimes.length > 0
                ? resolutionTimes.reduce((acc, time) => acc + time, 0) /
                  resolutionTimes.length
                : 0;

        res.json({
            total_high_priority: highPriorityTickets.length,
            average_resolution_time: averageResolutionTime,
            resolution_time_hours: averageResolutionTime.toFixed(2),
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
};
