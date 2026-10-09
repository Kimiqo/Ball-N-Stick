-- Read-only inventory. Run in the SQL editor of the affected project.
-- This reports current objects, unlike billing-period averages.
select bucket_id, count(*) as files,
       round(sum(coalesce((metadata->>'size')::bigint, 0)) / 1048576.0, 2) as total_mb
from storage.objects
group by bucket_id
order by total_mb desc;

select bucket_id, name, metadata->>'mimetype' as type,
       round((metadata->>'size')::bigint / 1048576.0, 2) as size_mb
from storage.objects
order by (metadata->>'size')::bigint desc nulls last
limit 50;

-- Do not DELETE or UPDATE storage.objects: Storage API operations are needed
-- to remove/replace the actual files as well as their metadata.
