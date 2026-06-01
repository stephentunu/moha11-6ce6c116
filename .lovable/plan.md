## Scope

Seven coordinated updates across polling, advertise, foundations, priorities, stories, news, and admin pages — plus a new bursary application system end-to-end (form → DB → admin view → simulated SMS).

## 1. Polling page updates (`src/lib/admin-store.ts`, `src/routes/polling.tsx`)

- Replace "Youth Hub" poll with **Service Rating Poll**: one question per service area (Education, Health, Security, Business Support, All, None) rated on a 3-point scale (Best, Fairly, Worst). Render as a rating grid (rows = services, columns = Best/Fairly/Worst radio-style buttons).
- Add `"High school Bursaries and scholarships"` option to the existing Education expansion poll.
- Persist multi-answer rating votes in local storage via `admin-store` so admin polls page can read aggregates.

## 2. Advertise / Business directory (`src/routes/advertise.tsx`, new business detail card)

Extend `businesses` table with new columns:
- `image_urls text[]` (gallery, replaces single `image_url` going forward; keep old col populated as cover for back-compat)
- `website_url text` (external link the photos open)
- `street text`
- `contacts text` (additional comma-separated contacts)
- `payment_methods text[]` (values: `send_money`, `pochi`, `till`, `paybill`, `cash`)
- `till_paybill_number text`
- `nearest_transport text`
- `delivery_available boolean`

Form:
- Multi-file upload (up to 5 images) into existing `business-images` storage bucket; collect array of public URLs.
- New inputs for Location/Street, Contacts, Payment methods (multi-select checkboxes), Nearest Transport, Delivery Availability toggle, optional Website URL.
- Public listing cards: photo carousel (shadcn `Carousel`), each slide wrapped in `<a href={website_url}>` when present, payment badges (Pochi, Till/Paybill, Cash, Send Money), "Delivery Available" badge, transport line.

## 3. Loyalty Link (`src/lib/loyalty.ts` new, used in advertise list)

- Track visits in `localStorage` key `moha_visit_count`, incremented once per session via root layout effect.
- Once count > 8, show a "Share this business" button on every business card that copies a deep link `${origin}/advertise#biz-${id}` (or opens native share).

## 4. Content refresh (`src/routes/news.tsx`, related sections)

- Top Stories – Education: copy update to "3.6M disbursed Term 1 2026".
- Top Stories – Health: list ID/Passport registration, Voter registration, SHA registration, GBV desk, Legal support.
- Business figures updated to **25M** and **50M** wherever shown (news + index highlight if present).
- Environment story: swap to a relevant Mathare environment image already present in `src/assets/moha`.

## 5. Priorities page (`src/routes/priorities.tsx`)

- Normalize every bullet/list item to start with a Capital Letter.

## 6. Featured Stories (`src/routes/stories.tsx`)

- Brian O. role → `"Grade 10 Student"`.
- Replace Coach Juma/Ouma entry with a **Student Voice** testimonial (name + quote about school/bursary/youth program).

## 7. Bursary system (multi-step form + admin + SMS)

**DB** — new table `bursary_applications`:
- student_name, dob, gender, id_or_birth_cert_number, phone
- school_name, current_grade (e.g. Grade 10), kcse_year (nullable for primary/JSS)
- guardian_name, guardian_phone, ward, residence_estate
- household_income_band, siblings_in_school
- amount_requested, reason (textarea), supporting_doc_url (optional)
- status (`pending` | `reviewing` | `approved` | `rejected`), admin_notes
- sms_last_sent_at, sms_last_message

RLS: INSERT open to public (so applicants can submit), SELECT/UPDATE restricted to authenticated admin only. Mirrors current admin model (admin pages already gate behind localStorage admin session — keep parity; tighten later as separate task).

**Form** (`src/routes/foundations.tsx` — new `<BursaryApplicationDialog />` section):
- 4 steps with progress: Student → School → Guardian/Household → Review & Submit.
- Zod validation on each step before allowing next.
- Submit → insert into `bursary_applications`, toast confirmation, give applicant a reference code (`BUR-{shortId}`).

**Admin** (new route `src/routes/admin.bursaries.tsx`):
- Table: ref, student, school, grade, ward, amount, status, submitted at.
- Row actions: view full details (dialog), change status, **Send SMS Feedback** (uses existing `sms.functions.ts` server fn — same Africa's Talking path used by bulk messaging; logs into `bulk_messages` + recipient row or a new `bursary_sms_log`, simulated if no provider creds).
- Add nav entry in `AdminLayout`.

## Technical notes

- Schema migrations bundled (businesses ALTER + new bursary table with GRANTs + RLS).
- `Carousel` + `Checkbox` + `Switch` shadcn components already present.
- SMS path reuses `src/lib/sms.functions.ts`; if provider creds missing it returns `{ simulated: true }` and we surface that in the admin toast.
- Loyalty visit counter increments on `__root` mount, guarded against SSR (`typeof window !== 'undefined'`).

## Out of scope (call out)

- Replacing the current localStorage admin auth with real Supabase auth + roles — flagged in prior audit; not part of this turn unless requested.
- Real SMS provider wiring — left simulated until Africa's Talking creds are provided.

## Execution order

1. DB migration (businesses columns + bursary_applications table + grants/RLS).
2. Wait for approval, then update `admin-store` + types, build forms, listings, admin view, content edits in parallel.
3. Verify each touched route returns 200 locally.
