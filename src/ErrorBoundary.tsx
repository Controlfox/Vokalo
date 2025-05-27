import React from "react";

type ErrorBoundaryProps = {children: React.ReactNode};
type ErrorBoundaryState = {hasError: boolean, error?: Error};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false};
    }
    static getDerivedStateFromError(error: Error) {
        return {hasError: true, error};
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log(error, errorInfo);
        console.error(error, errorInfo);
    }
    render() {
        if(this.state.hasError) {
            return <h2>Något gick fel: {this.state.error?.message}</h2>;
        }
        return this.props.children;
    }
}