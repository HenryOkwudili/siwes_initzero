// npx prisma db seed : to run seed
import UsersSeeder from './seeders/users.seeder';
import CoursesSeeder from './seeders/courses.seeder';

async function main() {
  await Promise.all([UsersSeeder.run(), CoursesSeeder.run()]);
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
