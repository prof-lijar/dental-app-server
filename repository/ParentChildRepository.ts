import { BaseRepository } from "./base.repository";
import { ParentChildMap } from "@/models/ParentChildMap";

export class ParentChildRepository extends BaseRepository<ParentChildMap> {
    protected tableName = "parent_child_map";
    protected primaryKey = "id";

    // get all children by parent id
    async findByParentId(parentId: string): Promise<ParentChildMap[]> {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE parent_id = $1
            ORDER BY created_at ASC
        `;
        const result = await this.executeQuery<ParentChildMap>(query, [parentId]);
        return result.rows;
    }

    // get all parents by child id
    async findByChildId(childId: string): Promise<ParentChildMap[]> {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE child_id = $1
            ORDER BY created_at ASC
        `;
        const result = await this.executeQuery<ParentChildMap>(query, [childId]);
        return result.rows;
    }

    // verify parent-child relationship exists
    async findByParentAndChildId(parentId: string, childId: string): Promise<ParentChildMap | null> {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE parent_id = $1 AND child_id = $2
            LIMIT 1
        `;
        const result = await this.executeQuery<ParentChildMap>(query, [parentId, childId]);
        return result.rows[0] || null;
    }
}
