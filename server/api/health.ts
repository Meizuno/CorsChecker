export default defineEventHandler((event) => {
  event.node.res.setHeader('Content-Type', 'text/plain');
  return 'OK';
});
