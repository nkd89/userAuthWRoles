import { DataSource } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { Permission } from '../../entities/permission.entity';

export const initialSeed = async (dataSource: DataSource): Promise<void> => {
    const permissionRepository = dataSource.getRepository(Permission);
    const roleRepository = dataSource.getRepository(Role);

    // Create default permissions
    const defaultPermissions = [
        'users.read',
        'users.update.self',
        'profiles.read',
        'profiles.update.self'
    ];

    const permissions = await Promise.all(
        defaultPermissions.map(async (name) => {
            let permission = await permissionRepository.findOne({ where: { name } });
            if (!permission) {
                permission = permissionRepository.create({ name });
                await permissionRepository.save(permission);
            }
            return permission;
        })
    );

    // Create default user role if it doesn't exist
    let userRole = await roleRepository.findOne({ where: { name: 'user' } });
    if (!userRole) {
        userRole = roleRepository.create({
            name: 'user',
            description: 'Default user role with basic permissions',
            permissions: permissions
        });
        await roleRepository.save(userRole);
    }
};
