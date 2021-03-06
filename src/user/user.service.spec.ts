import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { BcryptService } from '../auth/bcrypt.service';
import { userSchema } from './entities/user.model';
import { UserService } from './user.service';

describe('UserService', () => {
  const mockUser = {
    name: 'test',
    email: 'test@test.test',
    password: 'password',
  };

  const mockUserModel = {
    create: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn().mockResolvedValue(mockUser),
    findByIdAndUpdate: jest
      .fn()
      .mockResolvedValue({ ...mockUser, name: 'updated' }),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
  };

  const mockBcrypt = {
    encrypt: jest.fn().mockReturnValue('hashpw'),
    compare: jest.fn().mockReturnValue(true),
  };

  const mockAuth = {
    validateToken: jest.fn().mockReturnValue({ id: 'id' }),
    createToken: jest.fn().mockReturnValue('1f1f1f'),
  };

  const mockResponse = {
    user: mockUser,
    token: '1f1f1f',
  };

  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
      ],
      providers: [
        UserService,
        {
          provide: AuthService,
          useValue: mockAuth,
        },
        {
          provide: BcryptService,
          useValue: mockBcrypt,
        },
      ],
    })
      .overrideProvider(getModelToken('User'))
      .useValue(mockUserModel)
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When calling service.create', () => {
    test('Then it should return the saved user', async () => {
      const result = await service.create(mockUser);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('When calling service.login with valid login info', () => {
    test('Then it should return the user data and token', async () => {
      const result = await service.login({
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('When calling service.login with invalid email', () => {
    test('Then it should throw an unauthorized exception', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);
      expect(async () => {
        await service.login({
          email: mockUser.email,
          password: mockUser.password,
        });
      }).rejects.toThrow();
    });
  });

  describe('When calling service.login with invalid password', () => {
    test('Then it should throw an unauthorized exception', async () => {
      mockBcrypt.compare.mockReturnValueOnce(false);
      expect(async () => {
        await service.login({
          email: mockUser.email,
          password: mockUser.password,
        });
      }).rejects.toThrow();
    });
  });

  describe('When calling service.loginWithToken with a valid token', () => {
    test('Then it should return the user data and token', async () => {
      const result = await service.loginWithToken('token');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('When calling service.loginWithToken with invalid o expired token', () => {
    test('Then it should throw an unauthorized exception', async () => {
      mockAuth.validateToken.mockReturnValueOnce('error');
      expect(async () => {
        await service.loginWithToken('token');
      }).rejects.toThrow();
    });
  });

  describe('When calling service.loginWithToken with a valid token but user does not exist', () => {
    test('Then it should throw an unauthorized exception', async () => {
      mockUserModel.findById.mockResolvedValueOnce(null);
      expect(async () => {
        await service.loginWithToken('token');
      }).rejects.toThrow();
    });
  });
});
