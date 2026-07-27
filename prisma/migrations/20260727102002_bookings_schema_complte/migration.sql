-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- CreateTable
CREATE TABLE "Bookings" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
