CREATE TABLE "Users"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) CHECK
        (
            "role" IN('Customer', 'Technician', 'Admin')
        ) NOT NULL DEFAULT 'Customer',
        "status" VARCHAR(255)
    CHECK
        ("status" IN('ACTIVE', 'BANNED')) NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "Users" ADD PRIMARY KEY("id");
ALTER TABLE
    "Users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
CREATE INDEX "users_role_index" ON
    "Users"("role");
CREATE TABLE "categories"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "categories" ADD PRIMARY KEY("id");
ALTER TABLE
    "categories" ADD CONSTRAINT "categories_name_unique" UNIQUE("name");

    
CREATE TABLE "TechnicianProfiles"(
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "bio" VARCHAR(1000) NULL,
    "experienceYears" INTEGER NOT NULL,
    "skills" VARCHAR(255) NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "TechnicianProfiles" ADD PRIMARY KEY("id");
ALTER TABLE
    "TechnicianProfiles" ADD CONSTRAINT "technicianprofiles_userid_unique" UNIQUE("userId");
CREATE TABLE "Services"(
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) CHECK
        (
            "status" IN(
                'OPEN',
                'ASSIGNED',
                'COMPLETED',
                'CANCELLED'
            )
        ) NOT NULL DEFAULT 'OPEN'
);
ALTER TABLE
    "Services" ADD PRIMARY KEY("id");
CREATE INDEX "services_customer_id_index" ON
    "Services"("customer_id");
CREATE TABLE "Applications"(
    "id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "worker_id" UUID NOT NULL,
    "status" VARCHAR(255) CHECK
        (
            "status" IN(
                'PENDING',
                'ACCEPTED',
                'REJECTED',
                'WITHDRAWN'
            )
        ) NOT NULL DEFAULT 'PENDING',
        "applied_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "Applications" ADD CONSTRAINT "applications_service_id_worker_id_unique" UNIQUE("service_id", "worker_id");
ALTER TABLE
    "Applications" ADD PRIMARY KEY("id");
CREATE TABLE "Bookings"(
    "id" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "workerId" UUID NOT NULL,
    "status" VARCHAR(255) CHECK
        (
            "status" IN(
                'CONFIRMED',
                'IN_PROGRESS',
                'COMPLETED',
                'CANCELLED'
            )
        ) NOT NULL DEFAULT 'CONFIRMED',
        "booking_date" DATE NOT NULL,
        "start_time" TIME(0) WITHOUT TIME ZONE NOT NULL,
        "end_time" TIME(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "Bookings" ADD PRIMARY KEY("id");
CREATE TABLE "Payments"(
    "id" UUID NOT NULL,
    "bookingId" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentStatus" VARCHAR(255) CHECK
        (
            "paymentStatus" IN(
                'PENDING',
                'PAID',
                'FAILED',
                'REFUNDED'
            )
        ) NOT NULL DEFAULT 'PENDING',
        "transactionId" VARCHAR(255) NOT NULL,
        "paidAt" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
        "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "Payments" ADD PRIMARY KEY("id");
ALTER TABLE
    "Payments" ADD CONSTRAINT "payments_transactionid_unique" UNIQUE("transactionId");
CREATE TABLE "Reviews"(
    "id" UUID NOT NULL,
    "reviewerId" UUID NOT NULL,
    "workerId" UUID NOT NULL,
    "bookingId" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" VARCHAR(255) NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "Reviews" ADD PRIMARY KEY("id");
ALTER TABLE
    "Reviews" ADD CONSTRAINT "reviews_bookingid_unique" UNIQUE("bookingId");
CREATE TABLE "Notifications"(
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "Notifications" ADD PRIMARY KEY("id");
ALTER TABLE
    "Bookings" ADD CONSTRAINT "bookings_serviceid_foreign" FOREIGN KEY("serviceId") REFERENCES "Services"("id");
ALTER TABLE
    "Applications" ADD CONSTRAINT "applications_service_id_foreign" FOREIGN KEY("service_id") REFERENCES "Services"("id");
ALTER TABLE
    "TechnicianProfiles" ADD CONSTRAINT "technicianprofiles_userid_foreign" FOREIGN KEY("userId") REFERENCES "Users"("id");
ALTER TABLE
    "Reviews" ADD CONSTRAINT "reviews_reviewerid_foreign" FOREIGN KEY("reviewerId") REFERENCES "Users"("id");
ALTER TABLE
    "Reviews" ADD CONSTRAINT "reviews_workerid_foreign" FOREIGN KEY("workerId") REFERENCES "Users"("id");
ALTER TABLE
    "Payments" ADD CONSTRAINT "payments_bookingid_foreign" FOREIGN KEY("bookingId") REFERENCES "Bookings"("id");
ALTER TABLE
    "Notifications" ADD CONSTRAINT "notifications_userid_foreign" FOREIGN KEY("userId") REFERENCES "Users"("id");
ALTER TABLE
    "Bookings" ADD CONSTRAINT "bookings_workerid_foreign" FOREIGN KEY("workerId") REFERENCES "Users"("id");
ALTER TABLE
    "Applications" ADD CONSTRAINT "applications_worker_id_foreign" FOREIGN KEY("worker_id") REFERENCES "Users"("id");
ALTER TABLE
    "Services" ADD CONSTRAINT "services_customer_id_foreign" FOREIGN KEY("customer_id") REFERENCES "Users"("id");
ALTER TABLE
    "Reviews" ADD CONSTRAINT "reviews_bookingid_foreign" FOREIGN KEY("bookingId") REFERENCES "Bookings"("id");
ALTER TABLE
    "Services" ADD CONSTRAINT "services_categoryid_foreign" FOREIGN KEY("categoryId") REFERENCES "categories"("id");
ALTER TABLE
    "Bookings" ADD CONSTRAINT "bookings_customerid_foreign" FOREIGN KEY("customerId") REFERENCES "Users"("id");