import { object, ObjectSchema, string } from "yup";
import type { IAnnouncement } from "$lib/types/crud/announcement";

export default object({
    text: string().optional().max(512).label('Announcement Text'),
}) as ObjectSchema<IAnnouncement>;