import React from 'react';

export type ReactAdapterConsumerProps<P = {}> = Partial<P> & {
  fallback: React.SuspenseProps['fallback'];
  // the Adapter will be the same as the exported from ReactAdapterProvider
  importer: () => Promise<{
    default:
      | React.ComponentType<P>
      | React.ExoticComponent<P>
      | React.FunctionComponent<P>;
  }>;
};

export interface ReactAdapterConsumerState {}

class ReactAdapterConsumer<P = {}> extends React.Component<
  ReactAdapterConsumerProps<P>,
  ReactAdapterConsumerState
> {
  private RemoteComponent: React.ComponentType<P> | React.ExoticComponent<P>;

  constructor(props: ReactAdapterConsumerProps<P>) {
    super(props);
    this.RemoteComponent = React.lazy(() => this.props.importer());
  }

  render() {
    return (
      <React.Suspense fallback={this.props.fallback}>
        <this.RemoteComponent {...(this.props as React.PropsWithChildren<P>)} />
      </React.Suspense>
    );
  }
}

export default ReactAdapterConsumer;
