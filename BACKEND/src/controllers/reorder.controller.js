import { runReorderScan } from '../jobs/reorder.job.js';

export async function triggerReorderScan(req, res) {
  try {
    const { leadTimeDays, productId, warehouseId } = req.body;

    const specific = (productId && warehouseId) ? { productId, warehouseId } : null;

    await runReorderScan({
      leadTimeDays: leadTimeDays || Number(process.env.LEAD_TIME_DAYS || 3),
      specific
    });

    return res.json({
      success: true,
      message: 'Reorder scan completed successfully'
    });
  } catch (error) {
    console.error('triggerReorderScan error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}