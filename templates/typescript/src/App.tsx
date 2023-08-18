import { FC, useState } from '@freact/core';

export const App: FC = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div class='count'>count: {count}</div>
      <button onClick={() => setCount(x => x - 1)}>-</button>
      <button onClick={() => setCount(x => x + 1)}>+</button>
    </>
  );
};
