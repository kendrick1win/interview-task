import { QueryClient, QueryClientProvider } from "react-query";
import Data from "./Data";
import { TypeDistribution } from "./TypeDistribution";
import { PriorityDistribution } from "./PriorityDistribution";
import { ResolutionTimeAnalysis } from "./ResolutionTimeAnalysis";

import { IssuesList } from "./IssueList";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="p-4">
                <h1 className="mb-4 text-3xl">Backend Visualisations</h1>
                <TypeDistribution />
                <PriorityDistribution />
                <ResolutionTimeAnalysis />
                <h1 className="mb-4 mt-4 text-3xl">Frontend Visualisations</h1>
                <IssuesList />
                <h1 className="mb-4 mt-4 text-3xl">Data Display</h1>
                <Data />
            </div>
        </QueryClientProvider>
    );
}

export default App;
