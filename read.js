import { success, failure } from "./libs/response-lib";
import User from './model/user';
import HttpStatus from 'http-status-codes';
import { UUID_V1 } from './validators/user';

export async function main(event, context) {
  try {
    const id = event.pathParameters.id;

    if (!id) {
      return failure(HttpStatus.UNPROCESSABLE_ENTITY, {error : "ID Parameter required."});
    } else if (!id.match(UUID_V1)) {
      throw {message : "Required UUID V1 format."};
    }

    let user = new User();
    try {
      const result = await user.read(id);

      if (!result.Item) {
        return failure(HttpStatus.NOT_FOUND, {});
      }
      return success(HttpStatus.OK, result.Item);
    } catch (e) {
      return failure(HttpStatus.INTERNAL_SERVER_ERROR, {});
    }
  } catch (e) {
    console.info("Invalid ID [" + event.pathParameters.id + "]", e.message);
    return failure(HttpStatus.UNPROCESSABLE_ENTITY, {});
  }
}
