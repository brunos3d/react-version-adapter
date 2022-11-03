# react-version-adapter

This lib gives you the ability to use different major versions of React in your Module Federation application.

Module Federation allows us to create an adapter which attaches a hooks-friendly version to render a section of thr app using modern versions.

This components are part of the [module federation examples](https://github.com/module-federation/module-federation-examples/), you can find the [full example here](https://github.com/brunos3d/module-federation-examples/tree/feat/add-typescript-version-of-different-react-versions-sample/different-react-versions-typescript).

## How it works

This lib contains two important components, the `ReactAdapterConsumer` and `ReactAdapterProvider`. They are responsible to make the two versions of react work together.

The adapter consumes both versions of react to "translate" the props into a fresh render. This could be presented as a HOC or federated components could have a legacy export containing the adapter build in.

### [ReactAdapterProvider](./src/ReactAdaperProvider.tsx)

This component is responsible to dynamic render/hydrate the federated component using it host version of React.

This is a generic component type, so you can pass the generic parameter to the component to specify the type of the props.

```jsx
import React from 'react';

export interface ButtonProps {
  color: 'red' | 'blue';
}

const Button = (props: ButtonProps) => {
  return <button style={{ color: props.color }}>Click me</button>;
};

export const Adapted = React.forwardRef<
    ReactAdaperProvider<ModernReactComponentProps>,
    ModernReactComponentProps
  >((props, ref) => {
  // the intellisesne will show the type of the props if you try to modify it
  return (
    <ReactAdaperProvider<ButtonProps> component={Button} color="red" ref={ref} />
  );
});
```

### [ReactAdapterConsumer](./src/ReactAdapterConsumer.tsx)

This component is responsible to render the federated component using the remote version of React.

This is a generic component type, so you can pass the generic parameter to the component to specify the type of the props.

```jsx
// remeber to add path alias to your tsconfig.base.json at the root of the workspace and the type definition file of the remote component
// this demo contains an example that reproduce that but you can check in the gist below
// https://gist.github.com/brunos3d/80235047c74b27573234c774ed474ef8
import type { ButtonProps } from 'app2/Button';

<ReactAdapterConsumer<ButtonProps>
  // you can try to modify the color value and the intellisense automatically will show the type of the props
  color="blue"
  fallback={<div>Loading...</div>}
  importer={() => import('app2/Button').then(module => ({ default: module.Adapted }))}
/>;
```
