import { Fragment } from 'react';

const SkeletionLoader = () => {
  const element = (
    <div className="flex animate-pulse items-center space-x-4 p-3">
      <div className="h-10 w-10 rounded-full bg-slate-300"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-2 rounded bg-slate-400"></div>
        <div className="grid grid-cols-3">
          <div className="col-span-2 h-2 rounded bg-slate-400"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-sm rounded-md p-2">
      {Array.from(Array(10).keys()).map((el) => {
        return <Fragment key={el}>{element}</Fragment>;
      })}
    </div>
  );
};

export default SkeletionLoader;
