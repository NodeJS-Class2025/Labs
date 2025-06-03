import { TopicORM } from './Topic.orm.js';
import { PostORM } from './Post.orm.js';

TopicORM.hasMany(PostORM, { foreignKey: 'topicId', as: 'posts', onDelete: 'CASCADE' });
PostORM.belongsTo(TopicORM, { foreignKey: 'topicId', as: 'topic' });

export { TopicORM, PostORM };
