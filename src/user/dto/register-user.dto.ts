import { IsString, Matches, IsNotEmpty, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty() // 确保用户名不为空
  @Length(6, 30) // 确保用户名长度至少为4
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, { message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;
}
