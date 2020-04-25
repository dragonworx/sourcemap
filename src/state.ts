export type State = ReturnType<typeof initialState>;

export const initialState = () => ({
   title: 'untitled',
   count: 0,
});