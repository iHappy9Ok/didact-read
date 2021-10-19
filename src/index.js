import {Didact} from './utils/withoutHook'

  // /** @jsx Didact.createElement */
  // const element = (
  //   <div style="background: salmon">
  //     <h1>hhhhhh</h1>
  //     <h2 style="text-align:right">from Didact</h2>
  //   </div>
  // );
  
  // // const element = <Counter />;
  // const container = document.getElementById("root");
  // Didact.render(element, container);


  /** @jsx Didact.createElement */
  const container = document.getElementById("root")
  
  const updateValue = e => {
    rerender(e.target.value)
  }
  
  const rerender = value => {
    const element = (
      <div>
        <input onInput={updateValue} value={value} />
        <h2>Hello {value}</h2>
      </div>
    )
    Didact.render(element, container)
  }
  
  rerender("World")