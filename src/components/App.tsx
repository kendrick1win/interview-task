import { QueryClient, QueryClientProvider } from "react-query";
import Data from "./Data";
import { TypeDistribution } from "./TypeDistribution";
import { PriorityDistribution } from "./PriorityDistribution";
import { ResolutionTimeAnalysis } from "./ResolutionTimeAnalysis";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="p-4">
                <h1 className="mb-4 text-3xl">Data Display</h1>
                <TypeDistribution />
                <PriorityDistribution />
                <ResolutionTimeAnalysis />
                <Data />
            </div>
        </QueryClientProvider>
    );
}

export default App;
