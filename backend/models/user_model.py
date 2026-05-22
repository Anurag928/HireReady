from typing import List, Optional
from datetime import datetime
from dataclasses import dataclass, field

@dataclass
class UserModel:
    uid: str
    name: str
    email: str
    photoURL: str
    
    onboarding_completed: bool = False
    profile_complete: bool = False
    
    role: Optional[str] = None
    experience_level: Optional[str] = None
    skills: List[str] = field(default_factory=list)
    target_role: Optional[str] = None
    learning_goals: Optional[str] = None
    preferred_domain: Optional[str] = None
    
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    lastLogin: Optional[datetime] = None

    def to_dict(self):
        return {k: v for k, v in self.__dict__.items() if v is not None}
