import { Observable } from 'object-observer';

const state = {
   title: 'foo',
   items: [
      {title: 'a', count: 0}
   ]
};

const observable = Observable.from(state);
observable.observe((changes: any) => {
   changes.forEach((change: any) => {
      console.log(change);
  });
});

export const proxy = observable;

