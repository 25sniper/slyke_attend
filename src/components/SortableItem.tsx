import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Props {
    id: string;
    children: (dragHandle: React.ReactNode) => React.ReactNode;
}

export function SortableItem(props: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Create the handle element
    const DragHandle = (
        <div
            {...attributes}
            {...listeners}
            style={{
                cursor: 'grab',
                touchAction: 'none',
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <GripVertical size={24} />
        </div>
    );

    return (
        <div ref={setNodeRef} style={style}>
            {/* Pass the handle to the children render prop */}
            {props.children(DragHandle)}
        </div>
    );
}
