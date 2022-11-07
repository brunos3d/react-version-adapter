import React from 'react';

export type ReactAdapterConsumerProps<P = {}> = P & {
  fallback: React.SuspenseProps['fallback'];
  // the Adapter will be the same as the exported from ReactAdapterProvider
  importer: () => Promise<{
    default: React.ComponentType<P>;
  }>;
};

export interface ReactAdapterConsumerState {}

export class ReactAdapterConsumer<P = {}> extends React.Component<
  ReactAdapterConsumerProps<P>,
  ReactAdapterConsumerState
> {
  private RemoteComponent: React.LazyExoticComponent<React.ComponentType<P>>;

  constructor(props: ReactAdapterConsumerProps<P>) {
    super(props);
    this.RemoteComponent = React.lazy(() => this.props.importer());
  }

  render() {
    const { fallback, importer: _, ...rest } = this.props;
    return (
      <React.Suspense fallback={fallback}>
        <this.RemoteComponent {...(rest as any)} />
      </React.Suspense>
    );
  }
}

export default ReactAdapterConsumer;
