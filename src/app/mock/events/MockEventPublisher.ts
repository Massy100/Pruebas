export interface DomainEvent {
    eventName: string;
    occurredAt: Date;
    aggregateId: string;
    data: any;
}

export class MockEventPublisher {
    public publishedEvents: DomainEvent[] = [];

    async publish(event: DomainEvent): Promise<void> {
        this.publishedEvents.push(event);
        console.log(`Event published: ${event.eventName}`, event);
    }

    async publishBatch(events: DomainEvent[]): Promise<void> {
        this.publishedEvents.push(...events);
        console.log(`Batch of ${events.length} events published`);
    }

    getPublishedEvents(): DomainEvent[] {
        return [...this.publishedEvents];
    }

    clearEvents(): void {
        this.publishedEvents = [];
    }

    getEventsByType(eventName: string): DomainEvent[] {
        return this.publishedEvents.filter(e => e.eventName === eventName);
    }

    hasEvent(eventName: string): boolean {
        return this.publishedEvents.some(e => e.eventName === eventName);
    }
}