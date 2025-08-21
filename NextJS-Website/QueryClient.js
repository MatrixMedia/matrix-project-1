import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export function QueryClientProviderWrapper({
    children
}){
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}