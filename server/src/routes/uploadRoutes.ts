import { Router } from 'express';
import multer from 'multer';
import { authenticateJWT } from '../middleware/auth';
import { supabase } from '../config/supabase';
import { prisma } from '../prisma/client';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticateJWT);

router.post('/sop/:id/attachments', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const path = `sop/${id}/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage.from('sop-documents').upload(path, file.buffer, {
    contentType: file.mimetype
  });

  if (error) {
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }

  const publicUrl = supabase.storage.from('sop-documents').getPublicUrl(path).data.publicUrl;

  await prisma.sOPVersion.updateMany({
    where: { sopId: id, isCurrent: true },
    data: { content: publicUrl }
  });

  return res.status(201).json({ url: publicUrl });
});

router.post('/deviations/:id/evidence', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const path = `deviation/${id}/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage.from('deviation-evidence').upload(path, file.buffer, {
    contentType: file.mimetype
  });

  if (error) {
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }

  const publicUrl = supabase.storage.from('deviation-evidence').getPublicUrl(path).data.publicUrl;

  await prisma.deviation.update({
    where: { id },
    data: {
      description: prisma.deviation.fields.description.concat(`\n\nEvidence: ${publicUrl}`)
    }
  });

  return res.status(201).json({ url: publicUrl });
});

router.post('/audits/:id/files', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const path = `audit/${id}/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage.from('audit-files').upload(path, file.buffer, {
    contentType: file.mimetype
  });

  if (error) {
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }

  const publicUrl = supabase.storage.from('audit-files').getPublicUrl(path).data.publicUrl;

  await prisma.activityLog.create({
    data: {
      entityType: 'AUDIT',
      entityId: id,
      action: 'AUDIT_FILE_UPLOADED',
      actorId: req.user?.id,
      metadata: { url: publicUrl }
    }
  });

  return res.status(201).json({ url: publicUrl });
});

export default router;

