
export default function SkeletonHome() {
    return (
        <div style={{ opacity: 0.7 }}>
            {/* Header Skeleton */}
            <div style={{ padding: 'var(--spacing-lg)', paddingTop: '60px' }}>
                <div style={{
                    height: '32px',
                    width: '150px',
                    backgroundColor: 'var(--color-border)',
                    borderRadius: '8px'
                }} />
            </div>

            {/* Cards Skeleton */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="card" style={{
                    height: '120px',
                    margin: '0 var(--spacing-lg) var(--spacing-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)'
                }}>
                    {/* Inner structure to match a little better if we want, but outline is enough */}
                </div>
            ))}

            {/* FAB Skeleton */}
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                width: '56px',
                height: '56px',
                borderRadius: '28px',
                backgroundColor: 'var(--color-primary)',
                boxShadow: '0 4px 6px -1px var(--color-shadow)'
            }} />
        </div>
    );
}
