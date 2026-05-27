import app from './app.js';

const PORT = process.env.PORT || 4000;

const banner = `
╔════════════════════════════════════════╗
║      Todo Backend API Server Ready!    ║
║           Running on Port ${PORT}          ║
╚════════════════════════════════════════╝
`;

app.listen(PORT, () => {
  console.log(banner);
  console.log(`Server listening at http://localhost:${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
